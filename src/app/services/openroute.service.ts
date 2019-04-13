import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OpenRouteModel } from './openroute.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GPSConverter } from '../classes/gps-converter';
import { GpsLocation, KmLocation, SvgLocation } from '../classes/location.model';
import { RouteModel, StepInfo } from '../classes/route.model';

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

    getRoute(start: GpsLocation, destination: GpsLocation): Observable<RouteModel> {
        console.log(`Getting route for ${start} => ${destination}`);
        const url: string = `https://api.openrouteservice.org/v2/directions/driving-car?`
            + `api_key=${this.key}&start=`
            + `${start.lon},${start.lat}&end=${destination.lon},${destination.lat}`;
        return this.http.get<OpenRouteModel>(url)
            .pipe(
                // Multiply all coordinates with 100 otherwise the lines are so thin, they are sometimes not rendered correctly in Chrome.
                map(openRoute => {
                    let result = new RouteModel();
                    result.converter = new GPSConverter(openRoute.bbox);

                    result.gpsBBox = openRoute.bbox;
                    result.kmBBox = result.converter.bBoxGpsToKm(result.gpsBBox);
                    result.svgBBox = result.converter.bBoxKmToSvg(result.kmBBox);
                    result.gpsCoordinates = [];
                    for (const feature of openRoute.features) {
                        let coordinateOffset = result.gpsCoordinates.length;
                        for (const coordinate of feature.geometry.coordinates) {
                            const gps = new GpsLocation;
                            gps.lon = coordinate[0];
                            gps.lat = coordinate[1];
                            result.gpsCoordinates.push(gps);
                            result.kmCoordinates.push(result.converter.gpsToKm(gps));
                            result.svgCoordinates.push(result.converter.gpsToSvg(gps));
                        }
                        for (const segment of feature.properties.segments) {
                            for (const step of segment.steps) {
                                let nextStep = new StepInfo;
                                nextStep.coordinateIndex = step.way_points[0] + coordinateOffset;
                                nextStep.instruction = step.instruction;
                                nextStep.distance = step.distance;
                                nextStep.duration = step.duration;
                                result.directions.push(nextStep);
                            }
                        }
                    }
                    return result;
                })
        );
    }
}
