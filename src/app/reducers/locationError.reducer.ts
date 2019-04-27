import * as fromLocationError from '../actions/locationError.actions';

const initialState = true;

export function locationErrorReducer(state = initialState, action: fromLocationError.All): boolean {
    switch (action.type) {
        case fromLocationError.LOAD_LOCATION_ERROR: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
