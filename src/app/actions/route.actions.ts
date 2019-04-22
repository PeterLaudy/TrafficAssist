import { Action } from '@ngrx/store';
import { RouteModel } from '../classes/route.model';

export const LOAD_ROUTE = '[ROUTE] - Load Route';

export class LoadRoute implements Action {

    readonly type = LOAD_ROUTE;

    constructor(public payload: RouteModel) { }
}

export type All = LoadRoute;
