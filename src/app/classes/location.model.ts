import { GPSConverter } from './gps-converter';

/**
 * @class GpsLocation
 */
export class GpsLocation {
    public lat: number;
    public lon: number;
}

/**
 * This has a few convieniance methods.
 * @class KmLocation
 */
export class KmLocation {
    public x: number;
    public y: number;

    /**
     * Calculate the distance to another location.
     * @param other The other location to calculate the distance to.
     */
    public distance(other: KmLocation): number {
        const xDif = other.x - this.x;
        const yDif = other.y - this.y;
        return Math.sqrt(xDif * xDif + yDif * yDif);
    }

    /**
     * Calculate the location relative to another location.
     * @param other The other location to calculate the relative location to.
     */
    public translate(other: KmLocation): KmLocation {
        const result = new KmLocation();
        result.x = this.x - other.x;
        result.y = this.y - other.y;
        return result;
    }
}

/**
 * @class SvgLocation
 */
export class SvgLocation {
    public x: number;
    public y: number;
}

/**
 * Class which also contains the accuracy of the location.
 * Used in the current location received from a device.
 * @class AccurateLocation
 */
export class AccurateLocation {

    public kmLoc: KmLocation;
    public svgLoc: SvgLocation;

    /**
     * @param loc The location of the device
     * @param accuracy The accuracy of the location in meters
     */
    constructor(converter: GPSConverter, public loc: GpsLocation, public accuracy: number) {
        this.kmLoc = converter.gpsToKm(this.loc);
        this.svgLoc = converter.kmToSvg(this.kmLoc);
        this.accuracy = converter.relKmToSvg(this.accuracy / 1000);
    }
}
