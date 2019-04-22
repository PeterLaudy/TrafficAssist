import { GpsLocation, KmLocation, SvgLocation } from '../classes/location.model';

/**
 * Class representing a base event refence in the traffic model.
 */
export class BaseEvent {
    from: string;
    to: string;
    gpsFromLoc: GpsLocation;
    gpsToLoc: GpsLocation;
    kmFromLoc: KmLocation;
    kmToLoc: KmLocation;
    svgFromLoc: SvgLocation;
    svgToLoc: SvgLocation;
    reason: string;
    description: string;

    // The index of the first and last coordinate on the route.
    // Only set for traffic events which are on the route.
    first: number;
    last: number;
}

/**
 * Class representing a traffic jam refence in the traffic model.
 */
export class TrafficJam extends BaseEvent {
    location: string;
    delay: number;
    distance: number;
}

/**
 * Class representing a road work refence in the traffic model.
 */
export class RoadWork extends BaseEvent {
    location: string;
    start: Date;
    startDate: string;
    stop: Date;
    stopDate: string;
}

/**
 * Class representing a radar refence in the traffic model.
 */
export class Radar extends BaseEvent {
    location: string;
    gpsLoc: GpsLocation;
    kmLoc: KmLocation;
    svgLoc: SvgLocation;
    transform(): string {
        return `translate(${this.svgLoc.x},${this.svgLoc.y}) scale(0.25,-0.25)`;
    }
}

/**
 * Class representing a road refence in the traffic model.
 */
export class RoadEntry {
    name: string;
    type: string;
    trafficJams: TrafficJam[] = [];
    roadWorks: RoadWork[] = [];
    radars: Radar[] = [];
}

/**
 * Class representing the traffic model.
 */
export class TrafficModel {
    dateTime: string;
    roadEntries: RoadEntry[] = [];
}
