import { KmLocation } from './location.model';

export class RouteDetails {
    viewbox: string;
    transform: string = "";
    roads: KmLocation[][] = [];
    route: KmLocation[] = [];
}