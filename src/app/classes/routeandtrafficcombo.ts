import { TrafficModel, Radar, TrafficJam } from './traffic.model';
import { RouteModel } from './route.model';
import { KmLocation } from './location.model';
import { Observable } from 'rxjs';
import { AppState } from '../app-state';
import { Store } from '@ngrx/store';
import * as fromTrafficJamsActions from '../actions/traffic-jams.actions';
import * as fromRadarsActions from '../actions/radars.actions';
import { Injectable } from '@angular/core';

@Injectable()

/**
 * Class which combines the route and traffic information.
 * Since these (may) come from different servers, the GPS
 * locations might not always be 100% spot on. So we make
 * the comparisons a bit loose.
 */
export class RouteAndTrafficCombination {

    route$: Observable<RouteModel>;
    traffic$: Observable<TrafficModel>;

    route: RouteModel;

    constructor(private store: Store<AppState>) {
        this.route$ = this.store.select(s => s.route);
        this.traffic$ = this.store.select(s => s.traffic);

        this.route$.subscribe(route => {
            this.route = route;
        });

        this.traffic$.subscribe(traffic => {
            if (null != this.route) {
                this.combineWithTrafficInfo(traffic);
            }
        });
    }

    private combineWithTrafficInfo(traffic: TrafficModel) {
        this.combineRouteAndTraffic(traffic);
        this.combineRouteAndRadar(traffic);
    }

    /**
     * Get the segments of the calculated route where there is a traffic jam.
     */
    private combineRouteAndTraffic(traffic: TrafficModel) {
        const trafficJamList: TrafficJam[] = [];
        for (const road of traffic.roadEntries) {
            for (const trafficJam of road.trafficJams) {

                trafficJam.kmFromLoc = this.route.converter.gpsToKm(trafficJam.gpsFromLoc);
                trafficJam.kmToLoc = this.route.converter.gpsToKm(trafficJam.gpsToLoc);
                trafficJam.svgFromLoc = this.route.converter.kmToSvg(trafficJam.kmFromLoc);
                trafficJam.svgToLoc = this.route.converter.kmToSvg(trafficJam.kmToLoc);

                // Get the nearest coordinates for the start and end of the traffic jam.
                const first = this.getNearestCoordinate(trafficJam.kmFromLoc);
                const last = this.getNearestCoordinate(trafficJam.kmToLoc);

                // Is one of the two is on the route, we assume the taffic jam is.
                // This will include traffic jams wich are partially on our route.
                const isOnRoute = this.isOnSegment(trafficJam.kmFromLoc, first) || this.isOnSegment(trafficJam.kmToLoc, last);

                // Check if the traffic jam is not going in the opposite direction.
                if (first < last) {
                    if (isOnRoute) {
                        trafficJam.first = first;
                        trafficJam.last =  last;
                        trafficJamList.push(trafficJam);
                    }
                } else {
                    if (isOnRoute) {
                        console.log(`Wrong direction! ${trafficJam.description}`);
                    }
                }
            }
        }

        this.store.dispatch(new fromTrafficJamsActions.LoadTrafficJams(trafficJamList));
    }

    /**
     * Get the segments of the calculated route where there is a speed camera is set up.
     */
    private combineRouteAndRadar(traffic: TrafficModel) {
        const radarList: Radar[] = [];
        for (const road of traffic.roadEntries) {
            for (const radar of road.radars) {
                radar.kmFromLoc = this.route.converter.gpsToKm(radar.gpsFromLoc);
                radar.kmToLoc = this.route.converter.gpsToKm(radar.gpsToLoc);
                radar.svgFromLoc = this.route.converter.kmToSvg(radar.kmFromLoc);
                radar.svgToLoc = this.route.converter.kmToSvg(radar.kmToLoc);
                radar.kmLoc = this.route.converter.gpsToKm(radar.gpsLoc);
                radar.svgLoc = this.route.converter.kmToSvg(radar.kmLoc);

                // Get the nearest coordinate to the camera location ...
                const index: number = this.getNearestCoordinate(radar.kmLoc);

                // ... and check if the camera is on it.
                if (this.isOnSegment(radar.kmFromLoc, index)) {
                    // Get the nearest coordinates for the start and end of
                    // road section where the camera is set up.
                    const first = this.getNearestCoordinate(radar.kmFromLoc);
                    const last = this.getNearestCoordinate(radar.kmToLoc);

                    // Also check if the camera is not set up in the opposite direction.
                    if (first < last) {
                        radar.first = first;
                        radar.last = last;
                        radarList.push(radar);
                    } else {
                        console.log(`Wrong direction! ${radar.description}`);
                    }
                }
            }
        }

        this.store.dispatch(new fromRadarsActions.LoadTrafficRadars(radarList));
    }

    /**
     * Check if the given location is at the given segment of the calculated route.
     * @param location The location to check
     * @param index The index of the first coordinate of the segment
     * @todo Check if a margin of 1 km is not to inaccurate.
     */
    private isOnSegment(location: KmLocation, index: number): boolean {
        const MARGIN = 1; // Margin in x and y directions in kilometers.
        const minX = Math.min(this.route.kmCoordinates[index].x, this.route.kmCoordinates[index + 1].x) - MARGIN;
        const maxX = Math.max(this.route.kmCoordinates[index].x, this.route.kmCoordinates[index + 1].x) + MARGIN;
        const minY = Math.min(this.route.kmCoordinates[index].y, this.route.kmCoordinates[index + 1].y) - MARGIN;
        const maxY = Math.max(this.route.kmCoordinates[index].y, this.route.kmCoordinates[index + 1].y) + MARGIN;
        return ((location.x >= minX) && (location.x <= maxX) && (location.y >= minY) && (location.y <= maxY));
    }

    /**
     * Find the index of the coordinate on the route closest to the given location.
     * @param location The location for which to find the closest coordinate in the list.
     */
    private getNearestCoordinate(location: KmLocation): number {
        let minDist = 1000;
        let result = 0;
        for (let i = 0; i < this.route.kmCoordinates.length; i++) {
            const xDif = location.x - this.route.kmCoordinates[i].x;
            const yDif = location.y - this.route.kmCoordinates[i].y;
            const dist = Math.sqrt(xDif * xDif + yDif * yDif);
            if (dist < minDist) {
                minDist = dist;
                result = i;
            }
        }
        if (this.route.kmCoordinates.length - 1 === result) {
            result--;
        }
        return result;
    }
}
