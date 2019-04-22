import { Component, OnInit, Input } from '@angular/core';
import { Location } from '../classes/location.model';

@Component({
    // tslint:disable-next-line: component-selector
    selector: '[app-road]',
    templateUrl: './road.component.html',
    styleUrls: ['./road.component.css']
})

export class RoadComponent {

    @Input() road: Location[];

    constructor() { }
}
