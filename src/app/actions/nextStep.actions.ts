import { Action } from '@ngrx/store';

export const LOAD_NEXT_STEP = '[NEXT STEP] - Load Next Step';

export class LoadNextStep implements Action {

    readonly type = LOAD_NEXT_STEP;

    constructor(public payload: number) { }
}

export type All = LoadNextStep;
