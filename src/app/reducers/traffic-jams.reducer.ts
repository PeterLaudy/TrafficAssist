import * as fromTrafficJamsActions from '../actions/traffic-jams.actions';
import { TrafficJam } from '../classes/traffic.model';

const initialState: TrafficJam[] = [];

export function trafficJamsReducer(state = initialState, action: fromTrafficJamsActions.All): TrafficJam[] {
    switch (action.type) {
        case fromTrafficJamsActions.LOAD_TRAFFIC_JAMS: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
