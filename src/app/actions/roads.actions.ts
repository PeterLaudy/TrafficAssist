import { Action } from '@ngrx/store';
import { KmLocation } from '../classes/location.model';

export const LOAD_ROADS = '[ROADS] - Load Roads';
export const ADD_ROADS  = '[ROADS] - Add Roads';

export class LoadRoads implements Action {

    readonly type = LOAD_ROADS;

    constructor(public payload: KmLocation[][]) { }
}

export class AddRoads implements Action {

    readonly type = ADD_ROADS;

    constructor(public payload: KmLocation[][]) { }
}

export type All = LoadRoads | AddRoads;
