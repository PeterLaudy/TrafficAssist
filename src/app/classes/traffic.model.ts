import { GpsLocation, KmLocation, SvgLocation } from '../classes/location.model';

/**
 * @class BaseEvent
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
 * @class TrafficJam
 */
export class TrafficJam extends BaseEvent {
    location: string;
    delay: number;
    distance: number;
}

/**
 * @class RoadWork
 */
export class RoadWork extends BaseEvent {
    location: string;
    start: Date;
    startDate: string;
    stop: Date;
    stopDate: string;
}

/**
 * @class Radar
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
 * @class RoadEntry
 */
export class RoadEntry {
    name: string;
    type: string;
    trafficJams: TrafficJam[] = [];
    roadWorks: RoadWork[] = [];
    radars: Radar[] = [];
}

/**
 * @class TrafficModel
 */
export class TrafficModel {
    dateTime: string;
    roadEntries: RoadEntry[] = [];
}
