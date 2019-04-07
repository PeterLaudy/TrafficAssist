import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { last } from 'rxjs/operators';
import { SvgLocation } from '../services/anwb.model';

@Directive({
    selector: '[appPolyline]'
})
export class PolylineDirective implements AfterViewInit {
    @Input('appPolyline') coordinates: SvgLocation[];
    @Input('first') first: number;
    @Input('last') last: number;

    constructor(private el: ElementRef) { }

    ngAfterViewInit(): void {
        if (null == this.coordinates) {
            return;
        }
        if (null == this.first) {
            this.first = 0;
        } else {
            // This is comming from an attribute, so it is a string.
            this.first = Math.min(+this.first, this.coordinates.length - 1);
        }
        if (null == this.last) {
            this.last = this.coordinates.length - 1;
        } else {
            // This is comming from an attribute, so it is a string.
            this.last = Math.min(+this.last, this.coordinates.length - 1);
        }
        if (this.first < this.last) {
            let points: string = '';
            for (let i: number = this.first ; i <= this.last; i++) {
                points += `${this.coordinates[i].x},${this.coordinates[i].y} `;
            }
            this.el.nativeElement.setAttribute('points', points);
        }
    }
}
