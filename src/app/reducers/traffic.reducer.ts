import * as fromTrafficActions from '../actions/traffic.actions';
import { TrafficModel } from '../classes/traffic.model';

const initialState: TrafficModel = null;

export function trafficReducer(state = initialState, action: fromTrafficActions.All): TrafficModel {
    switch (action.type) {
        case fromTrafficActions.LOAD_TRAFFIC: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
