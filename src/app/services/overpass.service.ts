import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OverpassModel, Element } from './overpass.model';
import { map } from 'rxjs/internal/operators/map';
import { GPSConverter } from '../gps-converter';

@Injectable()

export class OverpassService {

    constructor(private http: HttpClient) { }

    getCities(converter: GPSConverter, bbox: number[]): Observable<Element[]> {
        console.log('Getting a list of cities');
        const x1 = bbox[0] - (bbox[2] - bbox[0]) / 2;
        const y1 = bbox[1] - (bbox[3] - bbox[1]) / 2;
        const x2 = bbox[2] + (bbox[2] - bbox[0]) / 2;
        const y2 = bbox[3] + (bbox[3] - bbox[1]) / 2;
        const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node["place"~"city|town"](${y1},${x1},${y2},${x2}););out;`;
        return this.http.get<OverpassModel>(url)
            .pipe(
                map(overpass => {
                    const result: Element[] = new Array<Element>();
                    for (const city of overpass.elements) {
                        let loc = converter.gpsToKm(city.lon, city.lat);
                        city.kmX = loc[0];
                        city.kmY = loc[1];
                        loc = converter.kmToSvg(city.kmX, city.kmY);
                        city.svgX = loc[0];
                        city.svgY = loc[1];
                        result.push(city);
                    }
                    return result;
                })
        );
    }
}
