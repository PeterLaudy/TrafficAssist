import { citiesReducer } from './cities.reducer';
import { myLocationReducer } from './my-location.reducer';
import { roadsReducer } from './roads.reducer';
import { trafficReducer } from './traffic.reducer';
import { routeReducer } from './route.reducer';
import { trafficJamsReducer } from './traffic-jams.reducer';
import { radarsReducer } from './radars.reducer';

export const appReducer  = {
    cities : citiesReducer,
    myLocation : myLocationReducer,
    roads : roadsReducer,
    route : routeReducer,
    traffic: trafficReducer,
    trafficJams: trafficJamsReducer,
    radars: radarsReducer
};
