import { AnwbObject, Radar, KmLocation, TrafficJam } from '../services/anwb.model';
import { OpenRouteModel, Feature } from '../services/openroute.model';

export class RouteAndTrafficCombination {

    trafficInfos: TrafficInfo[];
    radarInfos: Radar[];
    anwb: AnwbObject;

    constructor(private route: OpenRouteModel) { }

    combineWithTrafficInfo(traffic: AnwbObject) {
        this.anwb = traffic;
        this.combineRouteAndTraffic();
        this.combineRouteAndRadar();
    }

    /**
     * Get the segments of the calculated route where there is a traffic jam.
     */
    private combineRouteAndTraffic() {
        this.trafficInfos = [];
        let trafficInfo: TrafficInfo;
        for (const road of this.anwb.roadEntries) {
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
    private combineRouteAndRadar() {
        this.radarInfos = [];
        for (const road of this.anwb.roadEntries) {
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
    private isOnSegment(location: KmLocation, coordinates: KmLocation[], index: number): boolean {
        const minX = Math.min(coordinates[index].x, coordinates[index + 1].x) - 1;
        const maxX = Math.max(coordinates[index].x, coordinates[index + 1].x) + 1;
        const minY = Math.min(coordinates[index].y, coordinates[index + 1].y) - 1;
        const maxY = Math.max(coordinates[index].y, coordinates[index + 1].y) + 1;
        return ((location.x >= minX) && (location.x <= maxX) && (location.y >= minY) && (location.y <= maxY));
    }

    /**
     * Find the index of the coordinate in the given list closest to the given location.
     * @param location The location for which to find the closest coordinate in the list.
     * @param coordinates The list to search
     */
    private getNearestSegment(location: KmLocation, coordinates: KmLocation[]): number {
        let minDist = 1000;
        let result = 0;
        for (let i = 0; i < coordinates.length; i++) {
            const xDif = location.x - coordinates[i].x;
            const yDif = location.y - coordinates[i].y;
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
