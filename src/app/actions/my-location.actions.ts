import { Action } from '@ngrx/store';
import { AccurateLocation } from '../classes/location.model';

export const LOAD_LOCATION = '[LOCATION] - Load Location';

export class LoadLocation implements Action {

    readonly type = LOAD_LOCATION;

    constructor(public payload: AccurateLocation) { }
}

export type All = LoadLocation;
