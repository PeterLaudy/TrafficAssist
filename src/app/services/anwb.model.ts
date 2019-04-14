import { GpsLocation } from '../classes/location.model';

/**
 * @class AnwbEvent
 */
export interface AnwbEvent {
    alertC: string;
    text: string;
}

/**
 * @class AnwbTrafficJam
 */
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

/**
 * @class AnwbRoadWork
 */
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

/**
 * @class AnwbRadar
 */
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

/**
 * @class AnwbEvent
 */
export interface AnwbEvents {
    trafficJams: AnwbTrafficJam[];
    roadWorks: AnwbRoadWork[];
    radars: AnwbRadar[];
}

/**
 * @class AnwbRoadEntry
 */
export interface AnwbRoadEntry {
    road: string;
    roadType: string;
    events: AnwbEvents;
}

/**
 * @class AnwbModel
 */
export interface AnwbModel {
    dateTime: string;
    roadEntries: AnwbRoadEntry[];
}
