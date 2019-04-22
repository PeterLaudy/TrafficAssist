import { Component, Input } from '@angular/core';
import { TrafficJam } from '../classes/traffic.model';
import { Location } from '../classes/location.model';

@Component({
    // tslint:disable-next-line: component-selector
    selector: '[app-traffic-jam]',
    templateUrl: './traffic-jam.component.html',
    styleUrls: ['./traffic-jam.component.css']
})

export class TrafficJamComponent {

    @Input() trafficJam: TrafficJam;
    @Input() routeCoordinates: Location[];

    constructor() { }
}
