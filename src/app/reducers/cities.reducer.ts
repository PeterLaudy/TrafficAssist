import * as fromCitiesActions from '../actions/cities.actions';
import { City } from '../classes/city';

const initialState: City[] = null;

export function citiesReducer(state = initialState, action: fromCitiesActions.All): City[] {
    switch (action.type) {
        case fromCitiesActions.LOAD_CITIES: {
            return action.payload;
        }
        case fromCitiesActions.ADD_CITIES: {
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
