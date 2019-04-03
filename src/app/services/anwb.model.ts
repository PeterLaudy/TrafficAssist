export class Location {
    lat: number;
    lon: number;
}

export class Event {
    alertC: string;
    text: string;
}

export class TrafficJam {
    msgNr: string;
    from: string;
    fromLoc: Location;
    to: string;
    toLoc: Location;
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
}

export class RoadWork {
    msgNr: string;
    from: string;
    fromLoc: Location;
    to: string;
    toLoc: Location;
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
}

export class Radar {
    msgNr: string;
    from: string;
    fromLoc: Location;
    to: string;
    toLoc: Location;
    loc: Location;
    location: string;
    segStart: string;
    segEnd: string;
    reason: string;
    description: string;
    events: Event[];
    svgPosition?: string;
    svgPosX1?: number;
    svgPosY1?: number;
    svgPosX2?: number;
    svgPosY2?: number;
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
