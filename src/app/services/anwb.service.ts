import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnwbObject } from './anwb.model';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GPSConverter } from '../gps-converter';

@Injectable()

export class AnwbService {

    constructor(private http: HttpClient) { }

    getTraficInfo(converter: GPSConverter): Observable<AnwbObject> {
        console.log('Getting trafic information');
        return this.http.get<AnwbObject>('https://www.anwb.nl/feeds/gethf')
            .pipe(
                map(result => {
                    for (const road of result.roadEntries) {
                        for (const jam of road.events.trafficJams) {
                            jam.kmFromLoc = converter.locGpsToKm(jam.fromLoc);
                            jam.kmToLoc = converter.locGpsToKm(jam.toLoc);
                            jam.svgFromLoc = converter.locKmToSvg(jam.kmFromLoc);
                            jam.svgToLoc = converter.locKmToSvg(jam.kmToLoc);
                        }
                        for (const work of road.events.roadWorks) {
                            work.kmFromLoc = converter.locGpsToKm(work.fromLoc);
                            work.kmToLoc = converter.locGpsToKm(work.toLoc);
                            work.svgFromLoc = converter.locKmToSvg(work.kmFromLoc);
                            work.svgToLoc = converter.locKmToSvg(work.kmToLoc);
                        }
                        for (const radar of road.events.radars) {
                            radar.kmFromLoc = converter.locGpsToKm(radar.fromLoc);
                            radar.kmToLoc = converter.locGpsToKm(radar.toLoc);
                            radar.kmLoc = converter.locGpsToKm(radar.loc);
                            radar.svgFromLoc = converter.locKmToSvg(radar.kmFromLoc);
                            radar.svgToLoc = converter.locKmToSvg(radar.kmToLoc);
                            radar.svgLoc = converter.locKmToSvg(radar.kmLoc);
                        }
                    }
                    return result;
                })
        );
    }
}
