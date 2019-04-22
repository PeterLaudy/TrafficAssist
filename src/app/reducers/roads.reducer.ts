import * as fromRoadsActions from '../actions/roads.actions';
import { KmLocation } from '../classes/location.model';

const initialState: KmLocation[][] = null;

export function roadsReducer(state = initialState, action: fromRoadsActions.All): KmLocation[][] {
    switch (action.type) {
        case fromRoadsActions.LOAD_ROADS: {
            return action.payload;
        }
        case fromRoadsActions.ADD_ROADS: {
            return [
                ...state,
                ...action.payload
            ];
        }
        default: {
            return state;
        }
    }
}
