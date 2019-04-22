import { Component, OnInit } from '@angular/core';
import { AppState } from '../app-state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouteModel } from '../classes/route.model';
import { City } from '../classes/city';
import { AccurateLocation } from '../classes/location.model';
import { Radar, TrafficJam } from '../classes/traffic.model';

@Component({
    selector: 'app-route-summary',
    templateUrl: './route-summary.component.html',
    styleUrls: ['./route-summary.component.css']
})

export class RouteSummaryComponent implements OnInit {

    route$: Observable<RouteModel>;
    cities$: Observable<City[]>;
    myLocation$: Observable<AccurateLocation>;
    trafficJams$: Observable<TrafficJam[]>;
    radars$: Observable<Radar[]>;

    constructor(private store: Store<AppState>) { }

    ngOnInit() {
        this.route$ = this.store.select(s => s.route);
        this.cities$ = this.store.select(s => s.cities);
        this.myLocation$ = this.store.select(s => s.myLocation);
        this.trafficJams$ = this.store.select(s => s.trafficJams);
        this.radars$ = this.store.select(s => s.radars);
    }
}
