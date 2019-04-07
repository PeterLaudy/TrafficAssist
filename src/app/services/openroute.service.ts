import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OpenRouteModel, Geometry, KmGeometry, SvgGeometry } from './openroute.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GPSConverter } from '../classes/gps-converter';
import { GPSLocation } from './anwb.model';

@Injectable()

export class OpenrouteService {

    private key: string;

    constructor(private http: HttpClient) { }

    getAPIKey(): Observable<any> {
        return this.http.get<any>('assets/openrouteservice.key')
            .pipe(
                map(result => {
                    this.key = result.key;
                })
            );
    }

    getRoute(start: string[], destination: string[]): Observable<OpenRouteModel> {
        console.log(`Getting route for ${start} => ${destination}`);
        const url: string = `https://api.openrouteservice.org/v2/directions/driving-car?`
            + `api_key=${this.key}&start=`
            + `${start[0]},${start[1]}&end=${destination[0]},${destination[1]}`;
        return this.http.get<OpenRouteModel>(url)
            .pipe(
                // Multiply all coordinates with 100 otherwise the lines are so thin, they are sometimes not rendered correctly in Chrome.
                map(result => {
                    result.converter = new GPSConverter(result.bbox);

                    result.kmBBox = result.converter.bBoxGpsToKm(result.bbox);
                    result.svgBBox = result.converter.bBoxKmToSvg(result.kmBBox);
                    for (const f of result.features) {
                        f.kmBBox = result.converter.bBoxGpsToKm(f.bbox);
                        f.svgBBox = result.converter.bBoxKmToSvg(f.kmBBox);
                        f.kmGeometry = new KmGeometry();
                        f.kmGeometry.coordinates = [];
                        f.kmGeometry.type = f.geometry.type;
                        f.svgGeometry = new SvgGeometry();
                        f.svgGeometry.coordinates = [];
                        f.svgGeometry.type = f.geometry.type;
                        for (const c of f.geometry.coordinates) {
                            const gps = new GPSLocation;
                            gps.lon = c[0];
                            gps.lat = c[1];
                            f.kmGeometry.coordinates.push(result.converter.locGpsToKm(gps));
                            f.svgGeometry.coordinates.push(result.converter.locGpsToSvg(gps));
                        }
                    }
                    return result;
                })
        );
    }
}
