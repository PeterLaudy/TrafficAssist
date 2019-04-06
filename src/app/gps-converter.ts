import { GPSLocation, KmLocation, SvgLocation } from './services/anwb.model';
export class GPSConverter {

    // These variables are used to convert from km to SVG coordinates.
    // The SVG bounding box is -100, -100, 100, 100 (x1, y1, x2, y2).
    private scale: number;
    private xDif: number;
    private yDif: number;
    private kmBBox: number[]
    private svgBBox: number[]

    constructor(private gpsBBox: number[]) {
        this.kmBBox = this.bBoxGpsToKm(this.gpsBBox);

        const xScale = 170 / (this.kmBBox[2] - this.kmBBox[0]);
        const yScale = 170 / (this.kmBBox[3] - this.kmBBox[1]);
        this.scale = Math.min(xScale, yScale);

        this.xDif = (this.kmBBox[0] - this.kmBBox[2]) * (this.scale / 2) - this.kmBBox[0] * this.scale;
        this.yDif = (this.kmBBox[1] - this.kmBBox[3]) * (this.scale / 2) - this.kmBBox[1] * this.scale;
    }

    public gpsToKm(lon: number, lat: number): number[] {
        // Adjust for the radius at the given latitude.
        const xRadius = 40075 * Math.cos(Math.PI * lat / 180);
        const result: number[] = [];
        result.push(lon * (xRadius / 360));
        result.push(lat * (40008 / 360));
        return result;
    }

    public locGpsToKm(loc: GPSLocation): KmLocation {
        // Adjust for the radius at the given latitude.
        const kmLoc = this.gpsToKm(loc.lon, loc.lat);
        const result = new KmLocation();
        result.x = kmLoc[0];
        result.y = kmLoc[1];
        return result;
    }

    public bBoxGpsToKm(bbox: number[]): number[] {
        const result: number[] = [];
        const loc1 = this.gpsToKm(bbox[0], bbox[1]);
        const loc2 = this.gpsToKm(bbox[2], bbox[3]);
        result.push(loc1[0]);
        result.push(loc1[1]);
        result.push(loc2[0]);
        result.push(loc2[1]);
        return result;
    }

    public kmToSvg(x: number, y: number): number[] {
        // Adjust for the radius at the given latitude.
        const result: number[] = [];
        result.push(x * this.scale + this.xDif);
        result.push(y * this.scale + this.yDif);
        return result;
    }

    public locKmToSvg(loc: KmLocation): SvgLocation {
        // Adjust for the radius at the given latitude.
        const svgLoc = this.kmToSvg(loc.x, loc.y);
        const result = new SvgLocation();
        result.x = svgLoc[0];
        result.y = svgLoc[1];
        return result;
    }

    public bBoxKmToSvg(bbox: number[]): number[] {
        const result: number[] = [];
        const loc1 = this.kmToSvg(bbox[0], bbox[1]);
        const loc2 = this.kmToSvg(bbox[2], bbox[3]);
        result.push(loc1[0]);
        result.push(loc1[1]);
        result.push(loc2[0]);
        result.push(loc2[1]);
        return result;
    }

    public relKmToSvg(km: number): number {
        return km * this.scale;
    }
}
