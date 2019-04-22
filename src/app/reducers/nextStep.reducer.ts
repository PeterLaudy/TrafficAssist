import * as fromNextStepActions from '../actions/nextStep.actions';
import * as fromRouteActions from '../actions/route.actions';

const initialState = 0;

export function nextStepReducer(state = initialState, action: fromNextStepActions.All | fromRouteActions.All): number {
    switch (action.type) {
        case fromNextStepActions.LOAD_NEXT_STEP: {
            return action.payload;
        }
        case fromRouteActions.LOAD_ROUTE: {
            return 0;
        }
        default: {
            return state;
        }
    }
}
