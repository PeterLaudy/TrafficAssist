import { KmLocation } from './location.model';
import { RouteModel } from './route.model';

/**
 * Class which tries to keep track of where we are with respect to
 * the steps which make up the route.
 * @class NextStep
 */
export class NextStep {

    private angle: number;
    private origin: KmLocation;

    /**
     * Inistalize the class instance. Store the location (this.origin) we are expecting
     * to reach next.
     * @param routeInfo The route we are follwing.
     * @param stepIndex The index to the next step we are trying to reach.
     */
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

        this.angle = Math.atan2(xDif, yDif);
    }

    /**
     * Check if we have reached the next step.
     * @param location The location of the user.
     * @todo Let this method return the index of the coordinates
     *       we are in between. This will allow us to better
     *       handle the user leaving the route for a small detour,
     *       or even backtrack part of the route.
     */
    hasPassedNextStep(location: KmLocation): boolean {
        /**
         * The simplest check is the distance. If it is less then
         * 10 meters, we assume to have reached the location.
         */
        if (location.distance(this.origin) < 0.01) {
            return true;
        }

        /**
         * If that does not work, we imagine a line through the
         * location we are looking for which is perpendicular to the
         * line between the locations of the two steps before and
         * after this one. If we have crossed that line we also
         * assume to have reached the location we are monitoring.
         */
        const dif = location.translate(this.origin);
        const a = Math.atan2(dif.x, dif.y);
        let aDif = this.angle - a;
        while (aDif > Math.PI) {
            aDif -= 2 * Math.PI;
        }
        while (aDif < -Math.PI) {
            aDif += 2 * Math.PI;
        }
        if (Math.abs(aDif) <= (Math.PI / 2)) {
            return true;
        }

        /**
         * If that thid not do the trick, we might have missed a few steps.
         * In that case, we move a few steps ahead and then check if the
         * distance between step(n) and step(n+1) is larger then the distance
         * between our location and both of the formentioned steps. In that
         * case we assume we have reached step(n) and need to focus on step (n+1).
         * @todo We might want to check if we combine this check with the angle
         *       between our location and step(n+1) and the angle between both 
         *       steps. They should not be to far of.
         * @todo Even better would be to check this algorithm against each
         *       coordinate on the route. These coordinates can be seen as
         *       straight lines. If the route has a bend or curve, the
         *       coordinates will be closer together.
         */
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
}
