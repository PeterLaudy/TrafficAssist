import { Component, Input } from '@angular/core';
import { City } from '../classes/city';

@Component({
    // tslint:disable-next-line: component-selector
    selector: '[app-cities]',
    templateUrl: './cities.component.html',
    styleUrls: ['./cities.component.css']
})

export class CitiesComponent {

    @Input() cities: City[];

    constructor() { }
}
