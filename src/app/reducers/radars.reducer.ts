import * as fromRadarsActions from '../actions/radars.actions';
import { Radar } from '../classes/traffic.model';

const initialState: Radar[] = null;

export function radarsReducer(state = initialState, action: fromRadarsActions.All): Radar[] {
    switch (action.type) {
        case fromRadarsActions.LOAD_RADARS: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
