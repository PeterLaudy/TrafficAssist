import { KmLocation, AccurateLocation } from './location.model';
import { RouteModel } from './route.model';

/**
 * This class stored the details of the route which are displayed as 
 * a semi-transparent overlay. The size and the rotation of the 
 * overlay are also determined by this class.
 * @class RouteDetails
 */
export class RouteDetails {
    viewbox: string;
    transform: string = "";
    roads: KmLocation[][] = [];
    private angle: number = 0;

    constructor(public routeInfo: RouteModel) { }

    /**
     * Update the overlay map.
     */
    public updateDetailedLocation(myLoc: AccurateLocation, stepIndex: number) {
        if (stepIndex < this.routeInfo.directions.length) {
            /**
             * We show a 4x4 km section around the current location as the overlay.
             * The current location is at 20% of the bottom in the middle between
             * left and right.
             */
            let bbox = [myLoc.kmLoc.x - 2, myLoc.kmLoc.y - 0.8,
                        myLoc.kmLoc.x + 2, myLoc.kmLoc.y + 3.2];
            this.viewbox = `${bbox[0]} ${-bbox[3]} ${bbox[2] - bbox[0]} ${bbox[3] - bbox[1]}`;
 
            /**
             * The rotation is so that the next index is straight above us on the map.
             */
            const index = Math.min(stepIndex + 1, this.routeInfo.directions.length - 1);
            const relativeLoc = 
                this.routeInfo.kmCoordinates[this.routeInfo.directions[index].coordinateIndex].translate(
                    myLoc.kmLoc
                );
            let newAngle = Math.atan2(relativeLoc.x, relativeLoc.y) * 180 / Math.PI;
            while (newAngle - this.angle > 180) {
                newAngle -= 360;
            }
            while (newAngle - this.angle < -180) {
                newAngle += 360;
            }
            this.angle = this.angle * 0.9 + newAngle * 0.1;
            this.transform = `scale(1 -1) rotate(${this.angle} ${myLoc.kmLoc.x} ${myLoc.kmLoc.y})`;
        }
    }
}