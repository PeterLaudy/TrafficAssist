import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { SvgLocation } from '../classes/location.model';

@Directive({
    selector: '[appPolyline]'
})

/**
 * This class allows to set the points of an SVG polyline.
 * Since these are stored in the 'points' attribute, we
 * cannot use the *ngFor directive.
 * @class PolylineDirective
 */
export class PolylineDirective implements AfterViewInit {
    @Input('appPolyline') coordinates: SvgLocation[];
    @Input() first: string;
    @Input() last: string;

    constructor(private el: ElementRef) { }

    /**
     * This is where the actual magic happens.
     */
    ngAfterViewInit(): void {
        // We get the 3 attributes which are the coordinates to get the points from ...
        if (this.coordinates) {
            return;
        }

        // ... the first index in the array (or 0 if not specified) ...
        let first = 0;
        if (this.first) {
            // This is comming from an attribute, so it is a string.
            first = Math.min(+this.first, this.coordinates.length - 1);
        }

        // ... and the last index in the array (or the last one is not specified).
        let last = this.coordinates.length - 1;
        if (this.last) {
            // This is comming from an attribute, so it is a string.
            last = Math.min(+this.last, this.coordinates.length - 1);
        }

        // We don't set the 'points' attribute if there are no coordinates to show.
        if (first < last) {
            let points = '';
            // A simple for loop does the trick.
            for (let i = first ; i <= last; i++) {
                points += `${this.coordinates[i].x},${this.coordinates[i].y} `;
            }
            // Finally we set the attribute on the polyline element.
            this.el.nativeElement.setAttribute('points', points);
        }
    }
}
