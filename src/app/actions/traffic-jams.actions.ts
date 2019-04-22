import { Action } from '@ngrx/store';
import { TrafficJam } from '../classes/traffic.model';

export const LOAD_TRAFFIC_JAMS = '[TRAFFIC] - Load Traffic-Jams';

export class LoadTrafficJams implements Action {

    readonly type = LOAD_TRAFFIC_JAMS;

    constructor(public payload: TrafficJam[]) { }
}

export type All = LoadTrafficJams;
