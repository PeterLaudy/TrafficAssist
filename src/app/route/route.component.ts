import { Component, Input } from '@angular/core';
import { Location } from '../classes/location.model';

@Component({
    // tslint:disable-next-line: component-selector
    selector: '[app-route]',
    templateUrl: './route.component.html',
    styleUrls: ['./route.component.css']
})

export class RouteComponent {

    @Input() coordinates: Location[];
    @Input() lineWidth: string;
    @Input() lineOpacity: string;

    constructor() { }
}
