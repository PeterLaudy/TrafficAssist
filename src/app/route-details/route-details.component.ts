import { Component, OnInit } from '@angular/core';
import { AppState } from '../app-state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouteModel } from '../classes/route.model';
import { Location, AccurateLocation } from '../classes/location.model';
import { TrafficJam } from '../classes/traffic.model';

@Component({
    selector: 'app-route-details',
    templateUrl: './route-details.component.html',
    styleUrls: ['./route-details.component.css']
})

export class RouteDetailsComponent implements OnInit {

    route$: Observable<RouteModel>;
    roads$: Observable<Location[][]>;
    myLocation$: Observable<AccurateLocation>;
    traffic$: Observable<TrafficJam[]>;
    nextStep$: Observable<number>;

    roads: Location[][] = [];
    route: RouteModel = null;
    trafficJams: TrafficJam[] = [];
    myLocation: AccurateLocation = null;
    viewbox: string;
    transform = '';
    angle = 0;
    nextStep = 0;

    constructor(private store: Store<AppState>) {
        this.route$ = store.select(s => s.route);
        this.roads$ = store.select(s => s.roads);
        this.myLocation$ = store.select(s => s.myLocation);
        this.traffic$ = store.select(s => s.trafficJams);
        this.nextStep$ = store.select(s => s.nextStep);
    }

    ngOnInit() {
        this.nextStep$.forEach(step => {
            if (step) {
                this.nextStep = step;
            }
        });

        this.roads$.forEach(roads => {
            this.roads = roads;
        })

        this.route$.forEach(route => {
            this.route = route;
        });

        this.traffic$.forEach(traffic => {
            this.trafficJams = traffic;
        });

        this.myLocation$.forEach(myLoc => {
            this.myLocation = myLoc;
            if (this.route && (null != this.nextStep)) {
                let index = this.route.directions[this.nextStep].coordinateIndex;
                const goingTo = this.route.kmCoordinates[index];
                let distance = goingTo.distance(this.myLocation.kmLoc);
                distance = Math.max(0.5, Math.min(1, distance));

                const bbox = [this.myLocation.kmLoc.x - distance, this.myLocation.kmLoc.y - (distance * 0.4),
                              this.myLocation.kmLoc.x + distance, this.myLocation.kmLoc.y + (distance * 1.6)];
                this.viewbox = `${bbox[0]} ${-bbox[3]} ${bbox[2] - bbox[0]} ${bbox[3] - bbox[1]}`;

                index = Math.min(index + 1, this.route.directions.length - 1);
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
        });
    }
}
