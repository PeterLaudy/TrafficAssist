import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OpenRouteObject, Geometry } from './openroute.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GPSConverter } from '../gps-converter';

@Injectable()

export class OpenrouteService {

    private key: string;
    public converter: GPSConverter;

    constructor(private http: HttpClient) { }

    getAPIKey(): Observable<any> {
        return this.http.get<any>('assets/openrouteservice.key')
            .pipe(
                map(result => {
                    this.key = result.key;
                })
            );
    }

    getRoute(start: string[], destination: string[]): Observable<OpenRouteObject> {
        console.log(`Getting route for ${start} => ${destination}`);
        const url: string = `https://api.openrouteservice.org/v2/directions/driving-car?`
            + `api_key=${this.key}&start=`
            + `${start[0]},${start[1]}&end=${destination[0]},${destination[1]}`;
        return this.http.get<OpenRouteObject>(url)
            .pipe(
                // Multiply all coordinates with 100 otherwise the lines are so thin, they are sometimes not rendered correctly in Chrome.
                map(result => {
                    this.converter = new GPSConverter(result.bbox);

                    result.kmBBox = this.converter.bBoxGpsToKm(result.bbox);
                    result.svgBBox = this.converter.bBoxKmToSvg(result.kmBBox);
                    for (const f of result.features) {
                        f.kmBBox = this.converter.bBoxGpsToKm(f.bbox);
                        f.svgBBox = this.converter.bBoxKmToSvg(f.kmBBox);
                        f.kmGeometry = new Geometry();
                        f.kmGeometry.coordinates = [];
                        f.kmGeometry.type = f.geometry.type;
                        f.svgGeometry = new Geometry();
                        f.svgGeometry.coordinates = [];
                        f.svgGeometry.type = f.geometry.type;
                        for (const c of f.geometry.coordinates) {
                            const kmC: number[] = this.converter.gpsToKm(c[0], c[1]);
                            f.kmGeometry.coordinates.push(kmC);
                            const kmS: number[] = this.converter.kmToSvg(kmC[0], kmC[1]);
                            f.svgGeometry.coordinates.push(kmS);
                        }
                    }
                    return result;
                })
        );
    }
}
