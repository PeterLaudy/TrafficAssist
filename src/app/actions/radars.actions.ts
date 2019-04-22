import { Action } from '@ngrx/store';
import { Radar } from '../classes/traffic.model';

export const LOAD_RADARS = '[TRAFFIC] - Load Radars';

export class LoadTrafficRadars implements Action {

    readonly type = LOAD_RADARS;

    constructor(public payload: Radar[]) { }
}

export type All = LoadTrafficRadars;
