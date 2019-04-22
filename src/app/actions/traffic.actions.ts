import { Action } from '@ngrx/store';
import { TrafficModel } from '../classes/traffic.model';

export const LOAD_TRAFFIC = '[TRAFFIC] - Load Traffic';

export class LoadTraffic implements Action {

    readonly type = LOAD_TRAFFIC;

    constructor(public payload: TrafficModel) { }
}

export type All = LoadTraffic;
