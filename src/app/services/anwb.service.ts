import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnwbModel } from './anwb.model';
import { TrafficModel, RoadEntry, TrafficJam, RoadWork, Radar } from '../classes/traffic.model';
import { map } from 'rxjs/operators';
import { GPSConverter } from '../classes/gps-converter';
import { AppState } from '../app-state';
import * as fromTrafficActions from '../actions/traffic.actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable()

/**
 * Class which can get the Dutch traffic information from the ANWB web-server.
 * @class AnwbService
 */
export class AnwbService {

    constructor(private http: HttpClient, private store: Store<AppState>) { }

    /**
     * Make a call to the web-server to get the traffic information and
     * convert it to a more generic model. This way ot is easier to implement
     * other traffic servers as well.
     * @param converter The class to convert GPS coordinates to km and SVG.
     */
    getTraficInfo(): Observable<TrafficModel> {
        console.log('Getting trafic information');
        return this.http.get<AnwbModel>('https://www.anwb.nl/feeds/gethf')
            .pipe(
                map(anwbInfo => {
                    const result = new TrafficModel();
                    for (const anwbRoad of anwbInfo.roadEntries) {
                        const road = new RoadEntry();
                        road.name = anwbRoad.road;
                        road.type = anwbRoad.roadType;
                        for (const anwbTrafficJam of anwbRoad.events.trafficJams) {
                            const trafficJam = new TrafficJam();
                            trafficJam.description = anwbTrafficJam.description;
                            trafficJam.location = anwbTrafficJam.location;
                            trafficJam.reason = anwbTrafficJam.reason;
                            trafficJam.from = anwbTrafficJam.from;
                            trafficJam.to = anwbTrafficJam.to;
                            trafficJam.gpsFromLoc = anwbTrafficJam.fromLoc;
                            trafficJam.gpsToLoc = anwbTrafficJam.toLoc;

                            trafficJam.delay = trafficJam.delay;
                            trafficJam.distance = trafficJam.distance;

                            road.trafficJams.push(trafficJam);
                        }

                        for (const anwbRoadWork of anwbRoad.events.roadWorks) {
                            const roadWork = new RoadWork();
                            roadWork.description = anwbRoadWork.description;
                            roadWork.location = anwbRoadWork.location;
                            roadWork.reason = anwbRoadWork.reason;
                            roadWork.from = anwbRoadWork.from;
                            roadWork.to = anwbRoadWork.to;
                            roadWork.gpsFromLoc = anwbRoadWork.fromLoc;
                            roadWork.gpsToLoc = anwbRoadWork.toLoc;

                            roadWork.start = anwbRoadWork.start;
                            roadWork.startDate = anwbRoadWork.startDate;
                            roadWork.stop = anwbRoadWork.stop;
                            roadWork.stopDate = anwbRoadWork.stopDate;

                            road.roadWorks.push(roadWork);
                        }

                        for (const anwbRadar of anwbRoad.events.radars) {
                            const radar = new Radar();
                            radar.description = anwbRadar.description;
                            radar.location = anwbRadar.location;
                            radar.reason = anwbRadar.reason;
                            radar.from = anwbRadar.from;
                            radar.to = anwbRadar.to;
                            radar.gpsFromLoc = anwbRadar.fromLoc;
                            radar.gpsToLoc = anwbRadar.toLoc;

                            radar.gpsLoc = anwbRadar.loc;
                            road.radars.push(radar);
                        }

                        result.roadEntries.push(road);
                    }

                    this.store.dispatch(new fromTrafficActions.LoadTraffic(result));
                    return result;
                })
        );
    }
}
