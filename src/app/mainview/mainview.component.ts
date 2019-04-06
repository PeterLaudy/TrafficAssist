import { Component, OnInit } from '@angular/core';
import { Nominatum } from '../services/nominatum.model';
import { NominatumService } from '../services/nominatum.service';
import { OpenrouteService } from '../services/openroute.service';
import { OpenRouteObject, Feature, Geometry } from '../services/openroute.model';
import { AnwbService } from '../services/anwb.service';
import { AnwbObject, GPSLocation, TrafficJam, Radar, RoadWork, KmLocation, SvgLocation } from '../services/anwb.model';
import { OverpassService } from '../services/overpass.service';
import { Element } from '../services/overpass.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { timer, Observable, Subscription } from 'rxjs';
import { FullScreen } from '../services/full-screen.service';
import { GPSConverter } from '../gps-converter';
import { TalkToMeBaby } from '../services/talktomebaby.service';

@Component({
    selector: 'app-mainview',
    templateUrl: './mainview.component.html',
    styleUrls: ['./mainview.component.css']
})

/**
 * The main view showing the route and other information
 * @class MainviewComponent
 */
export class MainviewComponent implements OnInit {

    from: string;
    to: string;
    fromLoc: Nominatum;
    toLoc: Nominatum;
    route: OpenRouteObject;
    anwbInfo: AnwbObject;
    anwbTimer: Subscription;
    bbox: string;
    transform: string;
    trafficInfos: TrafficInfo[];
    radarInfos: Radar[];
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
    cities: Element[];
    myLocation: AccurateLocation;
    myLocationTimer: Subscription;
    currentLocation: number = -1;

    /**
     * Create the view
     * @param nominatum The service to get the GPS coordinates for an address
     * @param openRoute The service to calculate the route between two GPS coordinates
     * @param anwb The service to get the traffic information
     * @param overpass The service to get GeoLocation objects (cities in our case)
     * @param activatedRout The current route of the Angular routing service
     * @param fullScreen A simple wrapper around the browser fullscreen API
     */
    constructor(
        private nominatum: NominatumService,
        private openRoute: OpenrouteService,
        private anwb: AnwbService,
        private overpass: OverpassService,
        private activatedRout: ActivatedRoute,
        private fullScreen: FullScreen,
        private speak: TalkToMeBaby
    ) { }

    /**
     * Here we kick of the services.
     */
    ngOnInit() {
        // First we get the API key for the navigation routing service.
        // By putting it in aa seperate file, we prevent it from being
        // stored in the GitHub repository.
        this.openRoute.getAPIKey().subscribe(key =>
            this.activatedRout.paramMap.subscribe(route => {
                // Clean any existing data to clear the page.
                this.route = null;
                this.trafficInfos = null;
                this.cities = null;
                this.radarInfos = null;
                // From the URL parameters, we get the from and to addresses.
                this.from = route.get('from');
                this.to = route.get('to');
                // We get the GPS coordinate for the from address.
                this.nominatum.getLocation(this.from)
                    .subscribe(result => {
                        // Get the result and start getting the route if the to location is known.
                        this.fromLoc = result[0];
                        if (null != this.toLoc) {
                            this.getRoute();
                        }
                    });
                // We get the GPS coordinate for the to address.
                this.nominatum.getLocation(this.to)
                    .subscribe(result => {
                        // Get the result and start getting the route if the from location is known.
                        this.toLoc = result[0];
                        if (null != this.fromLoc) {
                            this.getRoute();
                        }
                    });
            })
        );
    }

    /**
     * Call the service to caclulate the route between the two given addresses.
     */
    getRoute() {
        this.openRoute.getRoute(
            [this.fromLoc.lon, this.fromLoc.lat], [this.toLoc.lon, this.toLoc.lat])
            .subscribe(result => {
                // Store the route.
                this.route = result;
                // Get the traffic information.
                this.startGettingANWBInfo();
                // Calculate the bounding box around the route.
                this.getMapSize();
                // Get the cities in that bounding box
                this.getCities();
                // Get the location of the device.
                this.startGettingMyLocation();
            });
    }

    /**
     * Call the service to get the traffic information.
     */
    private startGettingANWBInfo() {
        if (null != this.anwbTimer) {
            this.anwbTimer.unsubscribe();
        }
        this.anwbTimer = timer(1000, 30000).subscribe(response => {
            this.anwb.getTraficInfo(this.openRoute.converter).subscribe(trafic => {
                // Store the result.
                this.anwbInfo = trafic;
                // Combine the result with the route information.
                // The GPS coordinates of the traffic information do not
                // fully correspond to the ones of the calculated route.
                this.combineRouteAndTraffic();
                this.combineRouteAndRadar();
            });
        });
    }

    /**
     * Get the bounding box of the area covering the calculated route.
     * This information is used in the SVG object on the page.
     */
    getMapSize() {
        if ((this.anwbInfo != null) && (this.route != null)) {
            this.minLon = this.route.svgBBox[0];
            this.minLat = this.route.svgBBox[1];
            this.maxLon = this.route.svgBBox[2];
            this.maxLat = this.route.svgBBox[3];
            this.bbox = `${this.route.bbox[0]} ${this.route.bbox[1]} ` +
                        `${this.route.bbox[2] - this.route.bbox[0]} ${this.route.bbox[3] - this.route.bbox[1]}`;
            this.transform = `scale(1,-1)`;
        }
    }

    /**
     * call the service which gets all the cities in the area covering the calculated route.
     */
    getCities() {
        this.overpass.getCities(this.openRoute.converter, this.route.bbox)
            .subscribe(result => { this.cities = result; });
    }

    /**
     * Start a demonstration of the spoken navigation.
     */
    startDemo() {
        document.getElementById("home").hidden = true;
        document.getElementById("reverse").hidden = true;
        document.getElementById("demo").hidden = true;
        this.currentLocation = 0;
        const locEvent = timer(100, 250).subscribe(response => {
            const loc = new GPSLocation();
            loc.lon = this.route.features[0].geometry.coordinates[this.currentLocation][0];
            loc.lat = this.route.features[0].geometry.coordinates[this.currentLocation][1];
            this.myLocation = new AccurateLocation(this.openRoute.converter, loc, 25);
            this.checkForDirections();
            if (++this.currentLocation == this.route.features[0].geometry.coordinates.length) {
                this.currentLocation = -1;
                document.getElementById("home").hidden = false;
                document.getElementById("reverse").hidden = false;
                document.getElementById("demo").hidden = false;
                locEvent.unsubscribe();
            }
        });
    }

    /**
     * Start a timer which gets the devices GPS location at an interval of 5 seconds.
     */
    startGettingMyLocation() {
        if (null != this.myLocationTimer) {
            this.myLocationTimer.unsubscribe();
        }
        this.myLocationTimer = timer(1000, 5000).subscribe(response => {
            navigator.geolocation.getCurrentPosition(position => {
                const loc = new GPSLocation();
                loc.lon = position.coords.longitude;
                loc.lat = position.coords.latitude;
                this.myLocation = new AccurateLocation(this.openRoute.converter, loc, position.coords.accuracy);
            });
        });
    }

    /**
     * Check if spoken directions are requested.
     */
    checkForDirections() {
        this.route.features[0].properties.segments.forEach(segment => {
            segment.steps.forEach(step => {
                const index = step.way_points[0];
                const x = this.route.features[0].geometry.coordinates[index][0];
                const y = this.route.features[0].geometry.coordinates[index][1];
                if ((x === this.myLocation.loc.lon) &&
                    (y === this.myLocation.loc.lat)) {
                        this.speak.sayIt(step.instruction);
                    }
            });
        });
    }

    /**
     * Get the segments of the calculated route where there is a traffic jam.
     */
    combineRouteAndTraffic() {
        this.trafficInfos = [];
        let trafficInfo: TrafficInfo;
        for (const road of this.anwbInfo.roadEntries) {
            for (const jam of road.events.trafficJams) {
                for (const feature of this.route.features) {
                    const first = this.getNearestSegment(jam.kmFromLoc, feature.kmGeometry.coordinates);
                    const last = this.getNearestSegment(jam.kmToLoc, feature.kmGeometry.coordinates);
                    const isOnRoute = this.isOnSegment(jam.kmFromLoc, feature.kmGeometry.coordinates, first) &&
                                      this.isOnSegment(jam.kmToLoc, feature.kmGeometry.coordinates, last);
                    if (first < last) {
                        if (isOnRoute) {
                            trafficInfo = new TrafficInfo(jam, feature, first, last);
                            this.trafficInfos.push(trafficInfo);
                        }
                    } else {
                        if (isOnRoute) {
                            console.log(`Wrong direction! ${jam.description}`);
                        }
                    }
                }
            }
        }
    }

    /**
     * Get the segments of the calculated route where there is a speed camera is set up.
     */
    combineRouteAndRadar() {
        this.radarInfos = [];
        for (const road of this.anwbInfo.roadEntries) {
            for (const radar of road.events.radars) {
                for (const feature of this.route.features) {
                    const index: number = this.getNearestSegment(radar.kmLoc, feature.kmGeometry.coordinates);
                    if (this.isOnSegment(radar.kmFromLoc, feature.kmGeometry.coordinates, index)) {
                        const first = this.getNearestSegment(radar.kmFromLoc, feature.kmGeometry.coordinates);
                        const last = this.getNearestSegment(radar.kmToLoc, feature.kmGeometry.coordinates)
                        if (first < last) {
                            radar.svgFromLoc.x = feature.svgGeometry.coordinates[index][0];
                            radar.svgFromLoc.y = feature.svgGeometry.coordinates[index][1];
                            radar.svgToLoc.x = feature.svgGeometry.coordinates[index + 1][0];
                            radar.svgToLoc.y = feature.svgGeometry.coordinates[index + 1][1];
                            radar.svgPosition = `translate(${radar.svgLoc.x},${radar.svgLoc.y}) scale(0.25,-0.25)`;
                            this.radarInfos.push(radar);
                        }
                    }
                }
            }
        }
    }

    /**
     * Check if the given location is at the given segment of the calculated route.
     * @param location The location to check
     * @param start The minimum longtitude and latitude coordinates of the segment
     * @param stop The maximum longtitude and latitude coordinates of the segment
     */
    isOnSegment(location: KmLocation, coordinates: number[][], index: number): boolean {
        const minX = Math.min(coordinates[index][0], coordinates[index + 1][0]) - 1;
        const maxX = Math.max(coordinates[index][0], coordinates[index + 1][0]) + 1;
        const minY = Math.min(coordinates[index][1], coordinates[index + 1][1]) - 1;
        const maxY = Math.max(coordinates[index][1], coordinates[index + 1][1]) + 1;
        return ((location.x >= minX) && (location.x <= maxX) && (location.y >= minY) && (location.y <= maxY));
    }

    /**
     * Find the index of the coordinate in the given list closest to the given location.
     * @param location The location for which to find the closest coordinate in the list.
     * @param coordinates The list to search
     */
    getNearestSegment(location: KmLocation, coordinates: number[][]): number {
        let minDist = 1000;
        let result = 0;
        for (let i = 0; i < coordinates.length; i++) {
            const xDif = location.x - coordinates[i][0];
            const yDif = location.y - coordinates[i][1];
            const dist = Math.sqrt(xDif * xDif + yDif * yDif);
            if (dist < minDist) {
                minDist = dist;
                result = i;
            }
        }
        if (coordinates.length - 1 == result) {
            result--;
        }
        return result;
    }
}

/**
 * A class containing the processed information about a traffic jam.
 */
export class TrafficInfo {
    /**
     * @param trafficjam The traffic jam information as returned from the traffic information service
     * @param feature The GPS information of the calculated route
     * @param first The first coordinate of the traffic jam
     * @param last The last coordinate of the traffic jam
     */
    constructor(public trafficjam: TrafficJam, public feature: Feature, public first: number, public last: number) { }
}

/**
 * A class containing the processed information about the current location of the device.
 */
export class AccurateLocation {

    public kmLoc: KmLocation;
    public svgLoc: SvgLocation;

    /**
     * @param loc The location of the device
     * @param accuracy The accuracy of the location in meters
     */
    constructor(converter: GPSConverter, public loc: GPSLocation, public accuracy: number) {
        this.kmLoc = converter.locGpsToKm(this.loc);
        this.svgLoc = converter.locKmToSvg(this.kmLoc);
        this.accuracy = converter.relKmToSvg(this.accuracy / 1000);
    }
}
