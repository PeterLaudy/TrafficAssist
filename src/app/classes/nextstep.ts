import { KmLocation } from './location.model';
import { RouteModel } from './route.model';

export class NextStep {

    private angle: number;
    private origin: KmLocation;

    constructor(private routeInfo: RouteModel, private stepIndex: number) {
        let xDif: number;
        let yDif: number;
        if (0 == stepIndex) {
            this.origin = this.routeInfo.kmCoordinates[0];
            xDif = this.routeInfo.kmCoordinates[this.routeInfo.directions[1].coordinateIndex].x - this.origin.x;
            yDif = this.routeInfo.kmCoordinates[this.routeInfo.directions[1].coordinateIndex].y - this.origin.y;
        } else {
            this.origin = this.routeInfo.kmCoordinates[this.routeInfo.directions[stepIndex].coordinateIndex];
            const loc1 = this.routeInfo.kmCoordinates[this.routeInfo.directions[stepIndex - 1].coordinateIndex];
            const loc2 = this.routeInfo.kmCoordinates[this.routeInfo.directions[stepIndex + 1].coordinateIndex];
            xDif = loc2.x - loc1.x;
            yDif = loc2.y - loc1.y;
        }

        if ((0 == xDif) && (0 == yDif)) {
            console.error('Locations should not be the same.');
            throw 'Locations should not be the same.';
        }

        this.angle = Math.atan2(xDif, yDif);
    }

    hasPassedNextStep(location: KmLocation): boolean {
        const xDif = location.x - this.origin.x;
        const yDif = location.y - this.origin.y;
        const a = Math.atan2(xDif, yDif);
        let aDif = this.angle - a;
        while (aDif > Math.PI) {
            aDif -= 2 * Math.PI;
        }
        while (aDif < -Math.PI) {
            aDif += 2 * Math.PI;
        }

        if (Math.abs(aDif) >= (Math.PI / 2)) {
            if (this.routeInfo.directions.length - this.stepIndex > 5) {
                for (let i = this.stepIndex + 5; i < this.routeInfo.directions.length - 1; i++) {
                    let stepLoc = this.routeInfo.kmCoordinates[this.routeInfo.directions[i].coordinateIndex];
                    let nextStepLoc = this.routeInfo.kmCoordinates[this.routeInfo.directions[i + 1].coordinateIndex];
                    const stepDif = stepLoc.distance(nextStepLoc);
                    if ((location.distance(stepLoc) < stepDif) && (location.distance(nextStepLoc) < stepDif)) {
                        return true;
                    }
                }
            }
            return false;
        }
        return true;
    }
}
