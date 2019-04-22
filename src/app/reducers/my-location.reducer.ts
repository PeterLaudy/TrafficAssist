import * as fromLocationActions from '../actions/my-location.actions';
import { AccurateLocation } from '../classes/location.model';

const initialState: AccurateLocation = null;

export function myLocationReducer(state = initialState, action: fromLocationActions.All): AccurateLocation {
    switch (action.type) {
        case fromLocationActions.LOAD_LOCATION: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
