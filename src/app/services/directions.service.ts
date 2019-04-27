import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app-state';
import { Subscription } from 'rxjs';
import { RouteModel } from '../classes/route.model';
import { AccurateLocation, KmLocation } from '../classes/location.model';
import { NextStep } from '../classes/nextstep';
import { LoadNextStep } from '../actions/nextStep.actions';
import { TalkToMeBaby } from './talktomebaby.service';

@Injectable()

export class DirectionsService implements OnDestroy {

    routeSubscription: Subscription;
    routeInfo: RouteModel;
    locationSubscription: Subscription;
    myLocation: AccurateLocation;
    nextStepIndex = 0;
    nextInstructionToSpeak: any;

    /**
     * @param store The store which holds all general variable data for this application
     * @param speak A simple wrapper around the browser Speech Synthesis API
     */
    constructor(private store: Store<AppState>,
                private speak: TalkToMeBaby) {
        this.routeSubscription = this.store.select(s => s.route).subscribe(route => {
            this.routeInfo = route;
        });

        this.locationSubscription = this.store.select(s => s.myLocation).subscribe(location => {
            this.myLocation = location;
            if (this.routeInfo) {
                this.findNextDirection();
            }
        });
    }

    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
            this.routeSubscription = null;
        }

        if (this.locationSubscription) {
            this.locationSubscription.unsubscribe();
            this.locationSubscription = null;
        }
    }

    /**
     * Check if spoken directions are at order.
     */
    private findNextDirection() {
        const kmLoc = new KmLocation();
        const coordinateIndex = this.routeInfo.directions[this.nextStepIndex].coordinateIndex;
        kmLoc.x = this.routeInfo.kmCoordinates[coordinateIndex].x - this.myLocation.kmLoc.x;
        kmLoc.y = this.routeInfo.kmCoordinates[coordinateIndex].y - this.myLocation.kmLoc.y;
        const distance = Math.round(Math.sqrt(kmLoc.x * kmLoc.x + kmLoc.y * kmLoc.y) * 1000);

        // Any instructions are only spoken once, as soon as the distance
        // to the location they apply to is 300 meters or less.
        if ((300 >= distance) && (null != this.nextInstructionToSpeak)) {
            console.log(this.nextInstructionToSpeak);
            this.speak.sayIt(this.nextInstructionToSpeak);
            this.nextInstructionToSpeak = null;
        }

        // Here we check if we have reached the location of the last spoken instruction.
        // If so, we focus on the next one.
        let index = this.nextStepIndex;
        let nextStep = new NextStep(this.routeInfo, index);
        while ((null != nextStep) && nextStep.hasPassedNextStep(this.myLocation.kmLoc)) {
            index++;
            if (index < this.routeInfo.directions.length) {
                nextStep = new NextStep(this.routeInfo, index);
            } else {
                nextStep = null;
            }
        }

        // Check if the next instruction to speak has changed. If so, remember it
        // and tell everybody else the next step has changed.
        if (nextStep && (this.nextStepIndex !== index)) {
            this.nextStepIndex = index;
            this.store.dispatch(new LoadNextStep(this.nextStepIndex));
            this.nextInstructionToSpeak = this.routeInfo.directions[index].instruction;
        }
    }
}
