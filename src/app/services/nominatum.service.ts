import { Injectable } from '@angular/core';
import { Nominatum } from './nominatum.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()

export class NominatumService {

    constructor(private http: HttpClient) { }

    getLocation(address: string): Observable<Nominatum[]> {
        console.log(`Getting location for ${address}`);
        return this.http.get<Nominatum[]>(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`);
    }
}
