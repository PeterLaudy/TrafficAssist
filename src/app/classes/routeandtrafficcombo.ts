import { TrafficModel, Radar, TrafficJam } from './traffic.model';
import { RouteModel } from './route.model';
import { KmLocation } from './location.model';

export class RouteAndTrafficCombination {

    trafficJamList: TrafficJam[];
    radarList: Radar[];

    constructor(public route: RouteModel) { }

    combineWithTrafficInfo(traffic: TrafficModel) {
        this.combineRouteAndTraffic(traffic);
        this.combineRouteAndRadar(traffic);
    }

    /**
     * Get the segments of the calculated route where there is a traffic jam.
     */
    private combineRouteAndTraffic(traffic: TrafficModel) {
        this.trafficJamList = [];
        for (const road of traffic.roadEntries) {
            for (const trafficJam of road.trafficJams) {
                const first = this.getNearestSegment(trafficJam.kmFromLoc);
                const last = this.getNearestSegment(trafficJam.kmToLoc);
                const isOnRoute = this.isOnSegment(trafficJam.kmFromLoc, first) || this.isOnSegment(trafficJam.kmToLoc, last);
                if (first < last) {
                    if (isOnRoute) {
                        trafficJam.first = first;
                        trafficJam.last =  last;
                        this.trafficJamList.push(trafficJam);
                    }
                } else {
                    if (isOnRoute) {
                        console.log(`Wrong direction! ${trafficJam.description}`);
                    }
                }
            }
        }
    }

    /**
     * Get the segments of the calculated route where there is a speed camera is set up.
     */
    private combineRouteAndRadar(traffic: TrafficModel) {
        this.radarList = [];
        for (const road of traffic.roadEntries) {
            for (const radar of road.radars) {
                const index: number = this.getNearestSegment(radar.kmLoc);
                if (this.isOnSegment(radar.kmFromLoc, index)) {
                    const first = this.getNearestSegment(radar.kmFromLoc);
                    const last = this.getNearestSegment(radar.kmToLoc)
                    if (first < last) {
                        radar.first = first;
                        radar.last = last;
                        this.radarList.push(radar);
                    } else {
                        console.log(`Wrong direction! ${radar.description}`);
                    }
                }
            }
        }
    }

    /**
     * Check if the given location is at the given segment of the calculated route.
     * @param location The location to check
     * @param index The index of the first coordinate of the segment
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
    private getNearestSegment(location: KmLocation): number {
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
        if (this.route.kmCoordinates.length - 1 == result) {
            result--;
        }
        return result;
    }
}
