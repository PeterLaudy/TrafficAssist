import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app-state';
import { NextStep } from '../classes/nextstep';
import { RouteModel } from '../classes/route.model';
import { timer, Subscription, Observable } from 'rxjs';
import { GpsLocation, AccurateLocation } from '../classes/location.model';
import { LoadLocation } from '../actions/my-location.actions';
import { LoadLocationError } from '../actions/locationError.actions';

@Injectable()

export class LocationService implements OnDestroy {

    stepIndex: number;
    nextStep: NextStep;
    routeInfo: RouteModel;
    routeSubscription: Subscription = null;
    demoTimer: Subscription = null;
    myLocationTimer: Subscription = null;
    locationError = true;

    constructor(private store: Store<AppState>) {
        this.routeSubscription = this.store.select(s => s.route).subscribe(route => {
            if (this.demoTimer) {
                this.demoTimer.unsubscribe();
                this.demoTimer = null;
            }

            this.routeInfo = route;
        });

        this.startGettingMyLocation();
    }

    ngOnDestroy(): void {
        if (this.myLocationTimer) {
            this.myLocationTimer.unsubscribe();
            this.myLocationTimer = null;
        }

        if (this.demoTimer) {
            this.demoTimer.unsubscribe();
            this.demoTimer = null;
        }

        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
            this.routeSubscription = null;
        }
    }

    public startDemo() {
        if (!this.demoTimer) {
            let currentLocation = 0;
            this.stepIndex = 0;
            this.nextStep = new NextStep(this.routeInfo, 0);
            this.demoTimer = timer(100, 250).subscribe(response => {
                const loc = this.routeInfo.gpsCoordinates[currentLocation];
                this.updateLocation(loc, 25);
                if (++currentLocation === this.routeInfo.gpsCoordinates.length) {
                    this.demoTimer.unsubscribe();
                    this.demoTimer = null;
                }
            });
        }
    }

    /**
     * Start a timer which gets the devices GPS location at an interval of 0.25 seconds.
     */
    private startGettingMyLocation() {
        this.myLocationTimer = timer(100, 250).subscribe(response => {
            const options = {
                enableHighAccuracy: true,
                timeout: 200,
                maximumAge: 100
            };
            navigator.geolocation.getCurrentPosition(position => {
                // If the demo is running, we skip processing the location.
                if (!this.demoTimer && this.routeInfo) {
                    const loc = new GpsLocation();
                    loc.lon = position.coords.longitude;
                    loc.lat = position.coords.latitude;
                    this.updateLocation(loc, position.coords.accuracy);
                    if (this.locationError) {
                        this.locationError = false;
                        this.store.dispatch(new LoadLocationError(this.locationError));
                    }
                }
            }, error => {
                if (!this.locationError) {
                    this.locationError = true;
                    this.store.dispatch(new LoadLocationError(this.locationError));
                }
            }, options);
        });
    }

    /**
     * Update the location, check for directions and update the detailed map.
     * @param loc The new location of the device.
     * @param accuracy The accuracy of the location in meters.
     */
    private updateLocation(loc: GpsLocation, accuracy: number) {
        const location = new AccurateLocation(this.routeInfo.converter, loc, accuracy);
        this.store.dispatch(new LoadLocation(location));
    }
}
