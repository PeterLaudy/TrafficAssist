import { GpsLocation, KmLocation, SvgLocation } from '../classes/location.model';

export interface Osm3s {
    timestamp_osm_base: Date;
    copyright: string;
}

export interface Element {
    type: string;
    id: any;
    nodes?: number[];
    lon? : number;
    lat? : number;
    tags?: any;
}

export interface OverpassModel {
    version: number;
    generator: string;
    osm3s: Osm3s;
    elements: Element[];
}
