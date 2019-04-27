import { Action } from '@ngrx/store';

export const LOAD_LOCATION_ERROR = '[LOCATION ERROR] - Load Location Error';

export class LoadLocationError implements Action {

    readonly type = LOAD_LOCATION_ERROR;

    constructor(public payload: boolean) { }
}

export type All = LoadLocationError;
