import { GPSConverter } from '../classes/gps-converter';
import { GpsLocation, KmLocation, SvgLocation } from '../classes/location.model';

/**
 * @class StepInfo
 */
export class StepInfo {
    coordinateIndex: number;
    distance: number;
    duration: number;
    instruction: string;
}

/**
 * @class RouteModel
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
