import { GPSConverter } from '../classes/gps-converter';
import { GpsLocation, KmLocation, SvgLocation } from '../classes/location.model';

export class StepInfo {
    coordinateIndex: number;
    distance: number;
    duration: number;
    instruction: string;
}

export class RouteModel {
    gpsBBox: number[];
    kmBBox: number[];
    svgBBox: number[];
    converter: GPSConverter;
    gpsCoordinates: GpsLocation[] = [];
    kmCoordinates: KmLocation[] = [];
    svgCoordinates: SvgLocation[] = [];
    directions: StepInfo[] = [];
}
