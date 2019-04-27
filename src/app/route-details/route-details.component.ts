import { Component, OnInit } from '@angular/core';
import { AppState } from '../app-state';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { RouteModel } from '../classes/route.model';
import { Location, AccurateLocation } from '../classes/location.model';
import { TrafficJam } from '../classes/traffic.model';
import { CanDeactivatePage } from '../classes/can-deactivate-page';
import { DirectionsService } from '../services/directions.service';

@Component({
    selector: 'app-route-details',
    templateUrl: './route-details.component.html',
    styleUrls: ['./route-details.component.css']
})

export class RouteDetailsComponent extends CanDeactivatePage implements OnInit {

    route$: Observable<RouteModel>;
    roads$: Observable<Location[][]>;
    myLocation$: Observable<AccurateLocation>;
    traffic$: Observable<TrafficJam[]>;
    nextStep$: Observable<number>;

    routeSubcription: Subscription = null;
    roadsSubcription: Subscription = null;
    myLocationSubcription: Subscription = null;
    trafficSubcription: Subscription = null;
    nextStepSubcription: Subscription = null;

    roads: Location[][] = [];
    route: RouteModel = null;
    trafficJams: TrafficJam[] = [];
    myLocation: AccurateLocation = null;
    viewbox: string;
    transform = '';
    angle = 0;
    nextStep = 0;

    constructor(private store: Store<AppState>, private directionsService: DirectionsService) {
        super();

        this.route$ = store.select(s => s.route);
        this.roads$ = store.select(s => s.roads);
        this.myLocation$ = store.select(s => s.myLocation);
        this.traffic$ = store.select(s => s.trafficJams);
        this.nextStep$ = store.select(s => s.nextStep);
    }

    ngOnInit() {
        if (!this.nextStepSubcription) {
            this.nextStepSubcription = this.nextStep$.subscribe(step => {
                if (step) {
                    this.nextStep = step;
                }
            });
        }

        if (!this.roadsSubcription) {
            this.roadsSubcription = this.roads$.subscribe(roads => {
                this.roads = roads;
            });
        }

        if (!this.routeSubcription) {
            this.routeSubcription = this.route$.subscribe(route => {
                this.route = route;
            });
        }

        if (!this.trafficSubcription) {
            this.trafficSubcription = this.traffic$.subscribe(traffic => {
                this.trafficJams = traffic;
            });
        }

        if (!this.myLocationSubcription) {
            this.myLocationSubcription = this.myLocation$.subscribe(myLoc => {
                this.locationChanged(myLoc);
            });
        }
    }

    locationChanged(myLoc: AccurateLocation) {
        this.myLocation = myLoc;
        if (this.route && (null != this.nextStep)) {
            let index = this.route.directions[this.nextStep].coordinateIndex;
            const goingTo = this.route.kmCoordinates[index];
            let distance = goingTo.distance(this.myLocation.kmLoc);
            distance = Math.max(0.5, Math.min(1, distance));

            const bbox = [this.myLocation.kmLoc.x - distance, this.myLocation.kmLoc.y - (distance * 0.4),
                        this.myLocation.kmLoc.x + distance, this.myLocation.kmLoc.y + (distance * 1.6)];
            this.viewbox = `${bbox[0]} ${-bbox[3]} ${bbox[2] - bbox[0]} ${bbox[3] - bbox[1]}`;

            index = Math.min(this.nextStep + 1, this.route.directions.length - 1);
            const relativeLoc =
                this.route.kmCoordinates[this.route.directions[index].coordinateIndex].translate(
                    this.myLocation.kmLoc
                );

            let newAngle = Math.atan2(relativeLoc.x, relativeLoc.y) * 180 / Math.PI;
            while (newAngle - this.angle > 180) {
                newAngle -= 360;
            }
            while (newAngle - this.angle < -180) {
                newAngle += 360;
            }
            this.angle = this.angle * 0.9 + newAngle * 0.1;
            this.transform = `scale(1 -1) rotate(${this.angle} ${this.myLocation.kmLoc.x} ${this.myLocation.kmLoc.y})`;
        }
}

    canDeactivate(): boolean {
        if (!this.nextStepSubcription) {
            this.nextStepSubcription.unsubscribe();
            this.nextStepSubcription = null;
        }

        if (!this.roadsSubcription) {
            this.roadsSubcription.unsubscribe();
            this.roadsSubcription = null;
        }

        if (!this.routeSubcription) {
            this.routeSubcription.unsubscribe();
            this.routeSubcription = null;
        }

        if (!this.trafficSubcription) {
            this.trafficSubcription.unsubscribe();
            this.trafficSubcription = null;
        }

        if (!this.myLocationSubcription) {
            this.myLocationSubcription.unsubscribe();
            this.myLocationSubcription = null;
        }

        return true;
    }
}
