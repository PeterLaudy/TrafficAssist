import { RouteModel } from './classes/route.model';
import { KmLocation, AccurateLocation } from './classes/location.model';
import { City } from './classes/city';
import { TrafficModel, TrafficJam, Radar } from './classes/traffic.model';

export interface AppState {
    route: RouteModel;
    roads: KmLocation[][];
    cities: City[];
    myLocation: AccurateLocation;
    traffic: TrafficModel;
    trafficJams: TrafficJam[];
    radars: Radar[];
    nextStep: number;
}
