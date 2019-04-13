import { Injectable } from '@angular/core';
import { Nominatum } from './nominatum.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GpsLocation } from '../classes/location.model';

@Injectable()

export class NominatumService {

    constructor(private http: HttpClient) { }

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
