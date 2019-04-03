import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnwbObject } from './anwb.model';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OpenRouteObject } from './openroute.model';

@Injectable()

export class AnwbService {

    constructor(private http: HttpClient) { }

    getTraficInfo(oro: OpenRouteObject): Observable<AnwbObject> {
        console.log('Getting trafic information');
        return this.http.get<AnwbObject>('https://www.anwb.nl/feeds/gethf')
            .pipe(
                map(result => {
                    for (const road of result.roadEntries) {
                        for (const jam of road.events.trafficJams) {
                            jam.fromLoc.lon = this.xTransform(oro, jam.fromLoc.lon);
                            jam.fromLoc.lat = this.yTransform(oro, jam.fromLoc.lat);
                            jam.toLoc.lon = this.xTransform(oro, jam.toLoc.lon);
                            jam.toLoc.lat = this.yTransform(oro, jam.toLoc.lat);
                        }
                        for (const work of road.events.roadWorks) {
                            work.fromLoc.lon = this.xTransform(oro, work.fromLoc.lon);
                            work.fromLoc.lat = this.yTransform(oro, work.fromLoc.lat);
                            work.toLoc.lon = this.xTransform(oro, work.toLoc.lon);
                            work.toLoc.lat = this.yTransform(oro, work.toLoc.lat);
                        }
                        for (const radar of road.events.radars) {
                            radar.fromLoc.lon = this.xTransform(oro, radar.fromLoc.lon);
                            radar.fromLoc.lat = this.yTransform(oro, radar.fromLoc.lat);
                            radar.toLoc.lon = this.xTransform(oro, radar.toLoc.lon);
                            radar.toLoc.lat = this.yTransform(oro, radar.toLoc.lat);
                            radar.loc.lon = this.xTransform(oro, radar.loc.lon);
                            radar.loc.lat = this.yTransform(oro, radar.loc.lat);
                        }
                    }
                    return result;
                })
        );
    }

    private xTransform(oro: OpenRouteObject, x: number): number {
        return x * oro.scale + oro.xDif;
    }

    private yTransform(oro: OpenRouteObject, y: number): number {
        return y * oro.scale + oro.yDif;
    }
}
