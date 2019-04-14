import { GpsLocation, KmLocation, SvgLocation } from '../classes/location.model';

/**
 * @class Osm3s
 */
export interface Osm3s {
    timestamp_osm_base: Date;
    copyright: string;
}

/**
 * @class Element
 */
export interface Element {
    type: string;
    id: any;
    nodes?: number[];
    lon? : number;
    lat? : number;
    tags?: any;
}

/**
 * @class OverpassModel
 */
export interface OverpassModel {
    version: number;
    generator: string;
    osm3s: Osm3s;
    elements: Element[];
}
