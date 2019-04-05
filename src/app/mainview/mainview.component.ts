import { Component, OnInit } from '@angular/core';
import { Nominatum } from '../services/nominatum.model';
import { NominatumService } from '../services/nominatum.service';
import { OpenrouteService } from '../services/openroute.service';
import { OpenRouteObject, Feature } from '../services/openroute.model';
import { AnwbService } from '../services/anwb.service';
import { AnwbObject, Location, TrafficJam, Radar, RoadWork } from '../services/anwb.model';
import { OverpassService } from '../services/overpass.service';
import { Element } from '../services/overpass.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-mainview',
    templateUrl: './mainview.component.html',
    styleUrls: ['./mainview.component.css']
})

export class MainviewComponent implements OnInit {

    from: string;
    to: string;
    fromLoc: Nominatum;
    toLoc: Nominatum;
    route: OpenRouteObject;
    anwbInfo: AnwbObject;
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

    constructor(
        private nominatum: NominatumService,
        private openRoute: OpenrouteService,
        private anwb: AnwbService,
        private overpass: OverpassService,
        private activatedRout: ActivatedRoute
    ) { }

    ngOnInit() {
        this.activatedRout.paramMap.subscribe((route: ParamMap) => {
            this.from = route.get('from');
            this.to = route.get('to');
            this.nominatum.getLocation(this.from)
                .subscribe(result => { this.fromLoc = result[0]; this.getRoute(); });
            this.nominatum.getLocation(this.to)
                .subscribe(result => { this.toLoc = result[0]; this.getRoute(); });
        });
    }

    public toggleFullscreen() {
        const doc: any = window.document as Document & {
            exitFullscreen: any;
            mozCancelFullScreen: any;
            webkitExitFullscreen: any;
            msExitFullscreen: any;
        };
        const fsElement = document.getElementById('fullscreen') as HTMLElement & {
            requestFullscreen: any;
            mozRequestFullScreen: any;
            webkitRequestFullscreen: any;
            msRequestFullscreen: any;
        };

        const reqFS = fsElement.requestFullscreen || fsElement.mozRequestFullScreen ||
                      fsElement.webkitRequestFullscreen || fsElement.msRequestFullscreen;
        const cancelFS = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement) {
            cancelFS.call(doc);
        } else {
            cancelFS.call(fsElement);
        }
    }

    getRoute() {
        if ((this.fromLoc != null) && (this.toLoc != null)) {
            this.openRoute.getRoute(
                [this.fromLoc.lon, this.fromLoc.lat], [this.toLoc.lon, this.toLoc.lat])
                .subscribe(result => {
                    this.route = result;
                    this.startGettingANWBInfo();
                    this.getMapSize();
                    this.getCities();
                    this.startGettingMyLocation();
                });
        }
    }

    private startGettingANWBInfo() {
        timer(1000, 30000).subscribe(response => {
            this.anwb.getTraficInfo(this.route).subscribe(trafic => {
                this.anwbInfo = trafic;
                this.combineRouteAndTraffic();
                this.combineRouteAndRadar();
            });
        });
    }

    getMapSize() {
        if ((this.anwbInfo != null) && (this.route != null)) {
            this.minLon = this.route.bbox[0] / 100 - 0.05;
            this.minLat = this.route.bbox[1] / 100 - 0.05;
            this.maxLon = this.route.bbox[2] / 100 + 0.05;
            this.maxLat = this.route.bbox[3] / 100 + 0.05;
            this.bbox = `${this.route.bbox[0]} ${this.route.bbox[1]} ` +
                        `${this.route.bbox[2] - this.route.bbox[0]} ${this.route.bbox[3] - this.route.bbox[1]}`;
            this.transform = `translate(0, ${(this.route.bbox[1] * 2) + (this.route.bbox[3] - this.route.bbox[1])}) scale(1,-1)`;
        }
    }

    getCities() {
        this.overpass.getCities(this.route).subscribe(result => { this.cities = result; });
    }

    startGettingMyLocation() {
        timer(1000, 5000).subscribe(response => {
            navigator.geolocation.getCurrentPosition(position => {
                if (position.coords.accuracy < 2500) {
                    const loc = new Location();
                    loc.lon = this.xTransform(this.route, position.coords.longitude);
                    loc.lat = this.yTransform(this.route, position.coords.latitude);
                    this.myLocation = new AccurateLocation(loc, this.metersTransform(this.route, position.coords.accuracy));
                }
            });
        });
    }

    private metersTransform(oro: OpenRouteObject, m: number): number {
        m /= (40075000 / 360);
        return m * oro.scale;
    }

    private xTransform(oro: OpenRouteObject, x: number): number {
        // x * (40075 / 360) km
        return x * oro.scale + oro.xDif;
    }

    private yTransform(oro: OpenRouteObject, y: number): number {
        // 40075 * cos(Math.PI * y / 180) / 360 km
        return y * oro.scale + oro.yDif;
    }

    combineRouteAndTraffic() {
        this.trafficInfos = [];
        let foundStart = false;
        let foundStop = false;
        let trafficInfo: TrafficInfo;
        for (const road of this.anwbInfo.roadEntries) {
            for (const jam of road.events.trafficJams) {
                for (const feature of this.route.features) {
                    foundStart = foundStop = false;
                    for (let i = 0; i < feature.geometry.coordinates.length - 2; i++) {
                        if (foundStart) {
                            if (this.isOnSegment(jam.toLoc, feature.geometry.coordinates[i], feature.geometry.coordinates[i + 1])) {
                                foundStop = true;
                                break;
                            }
                        } else {
                            if (this.isOnSegment(jam.fromLoc, feature.geometry.coordinates[i], feature.geometry.coordinates[i + 1])) {
                                foundStart = true;
                            } else {
                                if (this.isOnSegment(jam.toLoc, feature.geometry.coordinates[i], feature.geometry.coordinates[i + 1])) {
                                    console.log(`Wrong direction! ${jam.description}`);
                                    break;
                                }
                            }
                        }
                    }
                    if (foundStart) {
                        const first = this.getNearestSegment(jam.fromLoc, feature.geometry.coordinates);
                        let last = feature.geometry.coordinates.length - 1;
                        if (foundStop) {
                            last = this.getNearestSegment(jam.toLoc, feature.geometry.coordinates);
                        }
                        trafficInfo = new TrafficInfo(jam, feature, first, last);
                        this.trafficInfos.push(trafficInfo);
                    }
                }
            }
        }
    }

    combineRouteAndRadar() {
        this.radarInfos = [];
        for (const road of this.anwbInfo.roadEntries) {
            for (const radar of road.events.radars) {
                for (const feature of this.route.features) {
                    for (let i = 0; i < feature.geometry.coordinates.length - 2; i++) {
                        if (this.isOnSegment(radar.fromLoc, feature.geometry.coordinates[i], feature.geometry.coordinates[i + 1])) {
                            const index: number = this.getNearestSegment(radar.loc, feature.geometry.coordinates);
                            radar.svgPosition = `translate(${radar.loc.lon},${radar.loc.lat}) scale(0.0025,-0.0025)`;
                            radar.svgPosX1 = feature.geometry.coordinates[index][0];
                            radar.svgPosY1 = feature.geometry.coordinates[index][1];
                            radar.svgPosX2 = feature.geometry.coordinates[index + 1][0];
                            radar.svgPosY2 = feature.geometry.coordinates[index + 1][1];
                            this.radarInfos.push(radar);
                            break;
                        }
                        if (this.isOnSegment(radar.toLoc, feature.geometry.coordinates[i], feature.geometry.coordinates[i + 1])) {
                            break;
                        }
                    }
                }
            }
        }
    }

    isOnSegment(location: Location, start: number[], stop: number[]): boolean {
        const minX = Math.min(start[0], stop[0]) - 0.5;
        const maxX = Math.max(start[0], stop[0]) + 0.5;
        const minY = Math.min(start[1], stop[1]) - 0.5;
        const maxY = Math.max(start[1], stop[1]) + 0.5;
        return ((location.lon >= minX) && (location.lon <= maxX) && (location.lat >= minY) && (location.lat <= maxY));
    }

    getNearestSegment(location: Location, coordinates: number[][]): number {
        let minDist = 1000;
        let result = 0;
        for (let i = 0; i < coordinates.length; i++) {
            const xDif = location.lon - coordinates[i][0];
            const yDif = location.lat - coordinates[i][1];
            const dist = Math.sqrt(xDif * xDif + yDif * yDif);
            if (dist < minDist) {
                minDist = dist;
                result = i;
            }
        }
        return result;
    }
}

export class TrafficInfo {
    constructor(public trafficjam: TrafficJam, public feature: Feature, public first: number, public last: number) { }
}

export class AccurateLocation {
    constructor(public loc: Location, public accuracy: number) { }
}
