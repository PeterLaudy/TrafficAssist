import * as fromRouteActions from '../actions/route.actions';
import * as fromTrafficJamsActions from '../actions/traffic-jams.actions';
import { TrafficJam } from '../classes/traffic.model';

const initialState: TrafficJam[] = [];

export function trafficJamsReducer(state = initialState, action: fromTrafficJamsActions.All | fromRouteActions.All): TrafficJam[] {
    switch (action.type) {
        case fromTrafficJamsActions.LOAD_TRAFFIC_JAMS: {
            return action.payload;
        }
        // If a new route is received we need to remove all the traffic jams for the previous route.
        case fromRouteActions.LOAD_ROUTE: {
            return [];
        }
        default: {
            return state;
        }
    }
}
