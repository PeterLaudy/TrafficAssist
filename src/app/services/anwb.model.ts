export class GPSLocation {
    lat: number;
    lon: number;
}

export class KmLocation {
    x: number;
    y: number;
}

export class SvgLocation {
    x: number;
    y: number;
}

export class Event {
    alertC: string;
    text: string;
}

export class TrafficJam {
    msgNr: string;
    from: string;
    fromLoc: GPSLocation;
    to: string;
    toLoc: GPSLocation;
    location: string;
    segStart: string;
    segEnd: string;
    start: Date;
    startDate: string;
    delay: number;
    distance: number;
    reason: string;
    description: string;
    events: Event[];
    kmFromLoc?: KmLocation;
    kmToLoc?: KmLocation;
    svgFromLoc?: SvgLocation;
    svgToLoc?: SvgLocation;
}

export class RoadWork {
    msgNr: string;
    from: string;
    fromLoc: GPSLocation;
    to: string;
    toLoc: GPSLocation;
    location: string;
    segStart: string;
    segEnd: string;
    start: Date;
    startDate: string;
    stop: Date;
    stopDate: string;
    reason: string;
    description: string;
    events: Event[];
    kmFromLoc?: KmLocation;
    kmToLoc?: KmLocation;
    svgFromLoc?: SvgLocation;
    svgToLoc?: SvgLocation;
}

export class Radar {
    msgNr: string;
    from: string;
    fromLoc: GPSLocation;
    to: string;
    toLoc: GPSLocation;
    loc: GPSLocation;
    location: string;
    segStart: string;
    segEnd: string;
    reason: string;
    description: string;
    events: Event[];
    svgPosition?: string;
    kmFromLoc?: KmLocation;
    kmToLoc?: KmLocation;
    kmLoc?: KmLocation;
    svgFromLoc?: SvgLocation;
    svgToLoc?: SvgLocation;
    svgLoc?: SvgLocation;
}

export class Events {
    trafficJams: TrafficJam[];
    roadWorks: RoadWork[];
    radars: Radar[];
}

export class RoadEntry {
    road: string;
    roadType: string;
    events: Events;
}

export class AnwbObject {
    dateTime: string;
    roadEntries: RoadEntry[];
}
