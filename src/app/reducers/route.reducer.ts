import * as fromRouteActions from '../actions/route.actions';
import { RouteModel } from '../classes/route.model';

const initialState: RouteModel = null;

export function routeReducer(state = initialState, action: fromRouteActions.All): RouteModel {
    switch (action.type) {
        case fromRouteActions.LOAD_ROUTE: {
            console.log(`Route found with ${action.payload.svgCoordinates.length} segments.`);
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
