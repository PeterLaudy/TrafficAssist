import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { last } from 'rxjs/operators';

@Directive({
    selector: '[appPolyline]'
})
export class PolylineDirective implements AfterViewInit {
    @Input('appPolyline') coordinates: number[];
    @Input('first') first: number;
    @Input('last') last: number;

    constructor(private el: ElementRef) { }

    ngAfterViewInit(): void {
        if (null == this.first) {
            this.first = 0;
        }
        if (null == this.last) {
            this.last = this.coordinates.length - 1;
        }
        let points: string = '';
        for (let i: number = this.first ; +i <= +this.last; i++) {
            points += `${this.coordinates[i][0]},${this.coordinates[i][1]} `;
        }
        this.el.nativeElement.setAttribute('points', points);
    }
}
