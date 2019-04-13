import { GpsLocation } from '../classes/location.model';

export interface AnwbEvent {
    alertC: string;
    text: string;
}

export interface AnwbTrafficJam {
    msgNr: string;
    from: string;
    fromLoc: GpsLocation;
    to: string;
    toLoc: GpsLocation;
    location: string;
    segStart: string;
    segEnd: string;
    start: Date;
    startDate: string;
    delay: number;
    distance: number;
    reason: string;
    description: string;
    events: AnwbEvent[];
}

export interface AnwbRoadWork {
    msgNr: string;
    from: string;
    fromLoc: GpsLocation;
    to: string;
    toLoc: GpsLocation;
    location: string;
    segStart: string;
    segEnd: string;
    start: Date;
    startDate: string;
    stop: Date;
    stopDate: string;
    reason: string;
    description: string;
    events: AnwbEvent[];
}

export interface AnwbRadar {
    msgNr: string;
    from: string;
    fromLoc: GpsLocation;
    to: string;
    toLoc: GpsLocation;
    loc: GpsLocation;
    location: string;
    segStart: string;
    segEnd: string;
    reason: string;
    description: string;
    events: AnwbEvent[];
}

export interface Events {
    trafficJams: AnwbTrafficJam[];
    roadWorks: AnwbRoadWork[];
    radars: AnwbRadar[];
}

export interface AnwbRoadEntry {
    road: string;
    roadType: string;
    events: Events;
}

export interface AnwbModel {
    dateTime: string;
    roadEntries: AnwbRoadEntry[];
}
