import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NominatimService } from '../services/nominatim.service';
import { OpenRouteService } from '../services/openroute.service';
import { RouteModel } from '../classes/route.model';
import { AnwbService } from '../services/anwb.service';
import { TrafficModel, TrafficJam, Radar } from '../classes/traffic.model';
import { GpsLocation, KmLocation, SvgLocation, AccurateLocation } from '../classes/location.model';
import { OverpassService } from '../services/overpass.service';
import { ActivatedRoute } from '@angular/router';
import { timer, Subscription } from 'rxjs';
import { FullScreen } from '../services/full-screen.service';
import { TalkToMeBaby } from '../services/talktomebaby.service';
import { RouteAndTrafficCombination } from '../classes/routeandtrafficcombo';
import { RouteDetails } from '../classes/routedetails';
import { City } from '../classes/city';
import { NextStep } from '../classes/nextstep';
import { PageUnload } from '../classes/page-unload';

@Component({
    selector: 'app-mainview',
    templateUrl: './mainview.component.html',
    styleUrls: ['./mainview.component.css']
})

/**
 * The main view showing the route and other information
 * @class MainviewComponent
 */
export class MainviewComponent extends PageUnload implements OnInit {

    from: string;
    to: string;
    fromLoc: GpsLocation;
    toLoc: GpsLocation;
    routeInfo: RouteModel;
    trafficInfo: TrafficModel;
    cities: City[] = [];

    anwbTimer: Subscription = null;
    myLocationTimer: Subscription = null;
    myLocation: AccurateLocation;
    demoTimer: Subscription = null;

    stepIndex: number = 0;
    nextStep: NextStep;
    nextInstructionToSpeak: string = null;
    distance: number = 0;
    locationError: boolean = false;

    routeDetails: RouteDetails
    routeAndTrafficCombo: RouteAndTrafficCombination;
    
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
        private nominatum: NominatimService,
        private openRoute: OpenRouteService,
        private anwb: AnwbService,
        private overpass: OverpassService,
        private activatedRout: ActivatedRoute,
        public fullScreen: FullScreen,
        private speak: TalkToMeBaby,
    ) {
        super();
    }

    /**
     * Here we kick of the services.
     */
    ngOnInit() {
        // First we get the API key for the navigation routing service.
        // By putting it in a seperate file, we can prevent it from being
        // stored in the GitHub repository.
        this.openRoute.getAPIKey().subscribe(key =>
            this.activatedRout.paramMap.subscribe(url => {
                // Clean any existing data to clear the page.
                this.cleanUp();
                // From the URL parameters, we get the from and to addresses.
                this.from = url.get('from');
                this.to = url.get('to');
                // We get the GPS coordinate for the from address.
                this.nominatum.getLocation(this.from)
                    .subscribe(result => {
                        // Get the result and start getting the route if the to location is known.
                        this.fromLoc = result;
                        if (null != this.toLoc) {
                            this.getRoute();
                        }
                    });
                // We get the GPS coordinate for the to address.
                this.nominatum.getLocation(this.to)
                    .subscribe(result => {
                        // Get the result and start getting the route if the from location is known.
                        this.toLoc = result;
                        if (null != this.fromLoc) {
                            this.getRoute();
                        }
                    });
            })
        );
    }

    /**
     * Method called just before the page is 'closed'.
     * Used to cleanup and unsubscribe any timers.
     * @returns False if the page can not be close, true otherwise.
     */
    canUnload(): boolean {
        this.cleanUp();
        return true;
    }

    /**
     * Release all references to local members and unsubscribe from all timers.
     */
    private cleanUp() {
        this.routeInfo = null;
        this.trafficInfo = null;
        this.cities = [];
        this.routeDetails = null;
        this.fromLoc = null;
        this.toLoc = null;
        this.nextStep = null;
        this.nextInstructionToSpeak = null;
        this.routeAndTrafficCombo = null;
        if (null != this.anwbTimer) {
            this.anwbTimer.unsubscribe();
            this.anwbTimer = null;
        }
        if (null != this.myLocationTimer) {
            this.myLocationTimer.unsubscribe();
            this.myLocationTimer = null;
        }
        if (null != this.demoTimer) {
            this.demoTimer.unsubscribe();
            this.demoTimer = null;
        }
    }

    /**
     * Call the service to caclulate the route between the two given addresses.
     */
    getRoute() {
        this.openRoute.getRoute(this.fromLoc, this.toLoc)
            .subscribe(result => {
                // Store the route.
                this.routeInfo = result;
                this.routeAndTrafficCombo = new RouteAndTrafficCombination(this.routeInfo);
                // Get the traffic information.
                this.startGettingANWBInfo();
                // Get the cities in that bounding box
                this.getCitiesAndRouteDetails();
                // Get the location of the device.
                this.startGettingMyLocation();
                // Inialize the first instruction.
                this.stepIndex = 0;
                this.nextStep = new NextStep(this.routeInfo, 0);
                this.nextInstructionToSpeak = this.routeInfo.directions[0].instruction;
            });
    }

    /**
     * Start a timer which calls the service to get the traffic information.
     */
    private startGettingANWBInfo() {
        if (null != this.anwbTimer) {
            this.anwbTimer.unsubscribe();
        }
        this.anwbTimer = timer(1000, 30000).subscribe(response => {
            this.anwb.getTraficInfo(this.routeInfo.converter).subscribe(traffic => {
                // Store the result.
                this.trafficInfo = traffic;
                // Combine the result with the route information.
                // The GPS coordinates of the traffic information do not
                // fully correspond to the ones of the calculated route.
                this.routeAndTrafficCombo.combineWithTrafficInfo(this.trafficInfo);
            });
        });
    }

    /**
     * Call the service which gets all the cities in the area covering the calculated route,
     * as well as the detailed information of the route itself, which are basically all roads
     * intersecting with the route.
     * @todo Check if this can be made more efficient. It now supports two strategies:
     *       - It takes all coordinates at the beginning of a step with an instruction and request the roads
     *         in a small area around the first coordinate of those steps.
     *       - It takes all coordinates that make up the route and request the roads in an equally sized area
     *         around each of them them. This strategy takes much more time on the server side. On the 60 km
     *         route between Sittard and Venlo (NL) it takes 45 seconds as to 10 seconds for the other strategy.
     */
    getCitiesAndRouteDetails() {
        const detailLocations: GpsLocation[] = [];

        // Toggle the comment on the next line between /* and //* to switch between the two blocks of code.
        //*
        this.routeInfo.directions.forEach(direction => {
            if (direction.instruction) {
                detailLocations.push(this.routeInfo.gpsCoordinates[direction.coordinateIndex]);
            }
        });
        /*/
        this.routeInfo.gpsCoordinates.forEach(gps => {
            detailLocations.push(gps);
        });
        //*/
        this.overpass.getCitiesAndRouteDetails(detailLocations, this.routeInfo.gpsBBox)
            .subscribe(result => {
                this.cities = result.cities;

                let details = new RouteDetails(this.routeInfo);
                result.roads.forEach(road => {
                    const svgRoad: KmLocation[] = [];
                    road.forEach(loc => {
                        svgRoad.push(this.routeInfo.converter.gpsToKm(loc));
                    });
                    details.roads.push(svgRoad);
                });

                this.routeDetails = details;
            });
    }

    /**
     * Start a demonstration of the spoken navigation.
     */
    startDemo() {
        document.getElementById("home").hidden = true;
        document.getElementById("reverse").hidden = true;
        document.getElementById("demo").hidden = true;
        let currentLocation = 0;
        this.stepIndex = 0;
        this.nextStep = new NextStep(this.routeInfo, 0);
        this.nextInstructionToSpeak = this.routeInfo.directions[0].instruction;
        this.demoTimer = timer(100, 250).subscribe(response => {
            let loc = this.routeInfo.gpsCoordinates[currentLocation];
            this.updateLocation(loc, 25);
            if (++currentLocation == this.routeInfo.gpsCoordinates.length) {
                document.getElementById("home").hidden = false;
                document.getElementById("reverse").hidden = false;
                document.getElementById("demo").hidden = false;
                this.demoTimer.unsubscribe();
                this.demoTimer = null;
            }
        });
    }

    /**
     * Start a timer which gets the devices GPS location at an interval of 0.25 seconds.
     */
    startGettingMyLocation() {
        if (null != this.myLocationTimer) {
            this.myLocationTimer.unsubscribe();
        }
        this.myLocationTimer = timer(100, 250).subscribe(response => {
            var options = {
                enableHighAccuracy: true,
                timeout: 200,
                maximumAge: 100
            };
            navigator.geolocation.getCurrentPosition(position => {
                // If the demo is running, we skip processing the location.
                if ((null == this.demoTimer) && (null != this.routeInfo)) {
                    this.locationError = false;
                    const loc = new GpsLocation();
                    loc.lon = position.coords.longitude;
                    loc.lat = position.coords.latitude;
                    this.updateLocation(loc, position.coords.accuracy);
                }
            }, error => {
                this.locationError = true;
            }, options);
        });
    }

    /**
     * Update the location, check for directions and update the detailed map.
     * @param loc The new location of the device.
     * @param accuracy The accuracy of the location in meters.
     */
    private updateLocation(loc: GpsLocation, accuracy: number) {
        this.myLocation = new AccurateLocation(this.routeInfo.converter, loc, accuracy);
        this.checkForDirections();
        if (null != this.routeDetails) {
            this.routeDetails.updateDetailedLocation(this.myLocation, this.stepIndex);
        }
    }

    /**
     * Check if spoken directions are at order.
     */
    checkForDirections() {
        let kmLoc = new KmLocation();
        const coordinateIndex = this.routeInfo.directions[this.stepIndex].coordinateIndex;
        kmLoc.x = this.routeInfo.kmCoordinates[coordinateIndex].x - this.myLocation.kmLoc.x;
        kmLoc.y = this.routeInfo.kmCoordinates[coordinateIndex].y - this.myLocation.kmLoc.y;
        const prevDistance = this.distance;
        this.distance = Math.round(Math.sqrt(kmLoc.x * kmLoc.x + kmLoc.y * kmLoc.y) * 1000);

        // Any instructions are only spoken once, as soon as the distance
        // to the location they apply to is 300 meters or less.
        if ((300 >= this.distance) && (null != this.nextInstructionToSpeak)) {
            console.log(this.nextInstructionToSpeak);
            this.speak.sayIt(this.nextInstructionToSpeak);
            this.nextInstructionToSpeak = null;
        }

        // Here we check if we have reached the location of the last spoken instruction.
        // If so, we focus on the next one.
        while ((null != this.nextStep) && this.nextStep.hasPassedNextStep(this.myLocation.kmLoc)) {
            this.stepIndex++;
            this.nextInstructionToSpeak = this.routeInfo.directions[this.stepIndex].instruction;
            if (this.stepIndex < this.routeInfo.directions.length - 1) {
                this.nextStep = new NextStep(this.routeInfo, this.stepIndex);
            } else {
                this.nextStep = null;
            }
        }
    }
}
