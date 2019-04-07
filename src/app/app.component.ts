import { Component } from '@angular/core';
import { Nominatum } from './services/nominatum.model';
import { NominatumService } from './services/nominatum.service';
import { OpenrouteService } from './services/openroute.service';
import { OpenRouteModel, Feature } from './services/openroute.model';
import { AnwbService } from './services/anwb.service';
import { AnwbObject, GPSLocation, TrafficJam } from './services/anwb.model';
import { PolylineDirective } from './directives/polyline.directive';
import { OverpassService } from './services/overpass.service';
import { Element } from './services/overpass.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    title = 'TrafficAssist';

    constructor() { }
}
