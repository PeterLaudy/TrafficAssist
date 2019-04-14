import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OpenRouteModel } from './openroute.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GPSConverter } from '../classes/gps-converter';
import { GpsLocation, KmLocation, SvgLocation } from '../classes/location.model';
import { RouteModel, StepInfo } from '../classes/route.model';

@Injectable()

/**
 * Class to communicate with the OpenRoute web-server.
 * It returns a route between two given GPS coordinates.
 * Note that an API key must be used, You can apply for
 * one at {@link https://openrouteservice.org/dev/|openroute service}
 * where you need to create an account.
 * @class OpenRouteService
 */
export class OpenRouteService {

    /**
     * The API key for this service.
     * It is stored in a seperate file (/assets/openrouteservice.key).
     * This way the key does not get stored in any version control repository.
     * For git use git update-index --assume-unchanged.
     */
    private key: string;

    constructor(private http: HttpClient) { }

    /**
     * Gets the API key from the server. This is not safe of course,
     * but hey, it is not my credit card number or anything like that.
     * But yes, to make things secure you would use this key only on
     * your server, not on the client side. That would mean that the
     * service itself also needed to be called from a server, not from
     * the browser. The project would then no longer be an Angular
     * only solution.
     */
    getAPIKey(): Observable<any> {
        return this.http.get<any>('assets/openrouteservice.key')
            .pipe(
                map(result => {
                    this.key = result.key;
                })
            );
    }

    /**
     * Make a call to the web-server and return the route in a more generic
     * model, so it is easier to switch to a different service. Note that a
     * lot of information is lost this way.
     * @param start The GPS location of the start address.
     * @param destination The GPS location of the destination address.
     */
    getRoute(start: GpsLocation, destination: GpsLocation): Observable<RouteModel> {
        console.log(`Getting route for ${start} => ${destination}`);
        const url: string = `https://api.openrouteservice.org/v2/directions/driving-car?`
            + `api_key=${this.key}&start=`
            + `${start.lon},${start.lat}&end=${destination.lon},${destination.lat}`;
        return this.http.get<OpenRouteModel>(url)
            .pipe(
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
                                nextStep.name = step.name;
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
