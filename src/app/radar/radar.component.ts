
import { Component, Input } from '@angular/core';
import { Radar } from '../classes/traffic.model';

@Component({
    // tslint:disable-next-line: component-selector
    selector: '[app-radar]',
    templateUrl: './radar.component.html',
    styleUrls: ['./radar.component.css']
})

export class RadarComponent {

    @Input() radar: Radar;

    constructor() { }

}
