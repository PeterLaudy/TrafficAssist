import { GPSConverter } from '../classes/gps-converter';
import { GpsLocation, KmLocation, SvgLocation } from '../classes/location.model';

/**
 * Class to keep track of the current spoken instruction.
 */
export class StepInfo {
    coordinateIndex: number;
    name: string;
    distance: number;
    duration: number;
    instruction: string;
}

/**
 * Class representing the model of the route.
 */
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
