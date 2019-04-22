import { GPSConverter } from './gps-converter';

/**
 * Class representing a location in the GPS coordinate system.
 */
export class GpsLocation {
    public lat: number;
    public lon: number;
}

/**
 * Base class representing a location.
 */
export class Location {
    public x: number;
    public y: number;
}

/**
 * Class representing a location where the coordinates are in kilometers.
 * It makes it easy to calculate the distance between coordinates, for
 * which it has a few convieniance methods.
 */
export class KmLocation extends Location {

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
 * Class representing a location in the SVG coordinate system.
 */
export class SvgLocation extends Location {
}

/**
 * Class which also contains the accuracy of the location.
 * Used in the current location received from a device.
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
