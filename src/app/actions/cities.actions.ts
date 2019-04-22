import { Action } from '@ngrx/store';
import { City } from '../classes/city';

export const LOAD_CITIES = '[CITIES] - Load Cities';
export const ADD_CITIES  = '[CITIES] - Add Cities';

export class LoadCities implements Action {

    readonly type = LOAD_CITIES;

    constructor(public payload: City[]) { }
}

export class AddCities implements Action {

    readonly type = ADD_CITIES;

    constructor(public payload: City[]) { }
}

export type All = LoadCities | AddCities;
