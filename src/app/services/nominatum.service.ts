import { Injectable } from '@angular/core';
import { Nominatum } from './nominatum.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GpsLocation } from '../classes/location.model';

@Injectable()

/**
 * Class to use the Nominatum web-server to convert street addresses to GPS coordinates.
 * @class NominatumService
 */
export class NominatumService {

    constructor(private http: HttpClient) { }

    /**
     * Make the actual call to the server and return the first result.
     * @param address The street address for which we want the GPS coordinates
     * @todo Return the whole list and let the user choose.
     */
    getLocation(address: string): Observable<GpsLocation> {
        console.log(`Getting location for ${address}`);
        return this.http.get<Nominatum[]>(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
            .pipe(
                map(locations => {
                    let result = new GpsLocation();
                    result.lon = locations[0].lon;
                    result.lat = locations[0].lat;
                    return result;
                })
            );
    }
}
