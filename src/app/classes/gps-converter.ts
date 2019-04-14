import { GpsLocation, KmLocation, SvgLocation } from '../classes/location.model';

/**
 * Class to convert between various coordinate systems (GPS, km and SVG).
 * Since GPS coordinates are mapped to the surface of the earth, we need
 * a conversion to do calculations (km) and display it on a screen (SVG).
 * 
 * Any bounding boxes used here are in the format (X1, Y1, X2, Y2).
 * Note that the SVG viewbox should be in the format (X, Y, W, H).
 * @class GPSConverter
 * @todo Maybe rename this to CoordinateConverter?
 */
export class GPSConverter {

    /**
     * These variables are used to convert from km to SVG coordinates.
     * The SVG bounding box is -100, -100, 100, 100 (x1, y1, x2, y2).
     * The boundingbox of the route is mapped to -85, -85, 85, 85.
     * This way no important details end up right at the edge of the view.
     */
    private scale: number;
    private xDif: number;
    private yDif: number;

    /**
     * Setup the bounding box and conversion parameters (scale and offset).
     * @param gpsBBox The bounding box of the area we want to display in GPS coordinates.
     */
    constructor(private gpsBBox: number[]) {
        if (null == gpsBBox) {
            throw new Error('The gpsBBox argument should not be null.');
        }
        if (gpsBBox.length != 4) {
            throw new Error('The gpsBBox argument should contain 4 elements.');
        }

        const kmBBox = this.bBoxGpsToKm(this.gpsBBox);

        // Set some margin around the area so no stuff ends up too close to the border.
        const xScale = 170 / (kmBBox[2] - kmBBox[0]);
        const yScale = 170 / (kmBBox[3] - kmBBox[1]);
        this.scale = Math.min(xScale, yScale);

        // We map the are to a square, even if it was a rectangle.
        this.xDif = (kmBBox[0] - kmBBox[2]) * (this.scale / 2) - kmBBox[0] * this.scale;
        this.yDif = (kmBBox[1] - kmBBox[3]) * (this.scale / 2) - kmBBox[1] * this.scale;
    }

    /**
     * The base converter from GPS to km.
     * @param lon Longtitude of the GPS coordinate.
     * @param lat Latitude of the GPS coordinate.
     * @returns The converted location as an array containing both coordinates.
     */
    private _gpsToKm(lon: number, lat: number): number[] {
        // Adjust for the radius of the earth at the given latitude.
        const xRadius = 40075 * Math.cos(Math.PI * lat / 180);
        const result: number[] = [];
        result.push(lon * (xRadius / 360));
        result.push(lat * (40008 / 360));
        return result;
    }

    public gpsToKm(loc: GpsLocation): KmLocation {
        const kmLoc = this._gpsToKm(loc.lon, loc.lat);
        const result = new KmLocation();
        result.x = kmLoc[0];
        result.y = kmLoc[1];
        return result;
    }

    public bBoxGpsToKm(bbox: number[]): number[] {
        const result: number[] = [];
        const loc1 = this._gpsToKm(bbox[0], bbox[1]);
        const loc2 = this._gpsToKm(bbox[2], bbox[3]);
        result.push(loc1[0]);
        result.push(loc1[1]);
        result.push(loc2[0]);
        result.push(loc2[1]);
        return result;
    }

    private _kmToSvg(x: number, y: number): number[] {
        const result: number[] = [];
        result.push(x * this.scale + this.xDif);
        result.push(y * this.scale + this.yDif);
        return result;
    }

    public kmToSvg(loc: KmLocation): SvgLocation {
        const svgLoc = this._kmToSvg(loc.x, loc.y);
        const result = new SvgLocation();
        result.x = svgLoc[0];
        result.y = svgLoc[1];
        return result;
    }

    public bBoxKmToSvg(bbox: number[]): number[] {
        const result: number[] = [];
        const loc1 = this._kmToSvg(bbox[0], bbox[1]);
        const loc2 = this._kmToSvg(bbox[2], bbox[3]);
        result.push(loc1[0]);
        result.push(loc1[1]);
        result.push(loc2[0]);
        result.push(loc2[1]);
        return result;
    }

    public gpsToSvg(loc: GpsLocation): SvgLocation {
        return this.kmToSvg(this.gpsToKm(loc));
    }

    public bBoxGpsToSvg(bbox: number[]): number[] {
        return this.bBoxKmToSvg(this.bBoxGpsToKm(bbox));
    }

    /**
     * Convert a distance in km to the SVG coordinate system.
     * This can be used to show the accuracy of the location as
     * a semi transparent circle on the map.
     * @param km The distance in km.
     * @returns The distance in SVG coordinates.
     */
    public relKmToSvg(km: number): number {
        return km * this.scale;
    }
}
