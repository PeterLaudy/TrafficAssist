import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NominatimService } from './services/nominatim.service';
import { HttpClientModule } from '@angular/common/http';
import { OpenRouteService } from './services/openroute.service';
import { AnwbService } from './services/anwb.service';
import { PolylineDirective } from './directives/polyline.directive';
import { OverpassService } from './services/overpass.service';
import { MainviewComponent } from './mainview/mainview.component';
import { HomeComponent } from './home/home.component';
import { TalkToMeBaby } from './services/talktomebaby.service';
import { FullScreen } from './services/full-screen.service';
import { CanDeactivatePage } from './classes/can-deactivate-page';
import { RouteSummaryComponent } from './route-summary/route-summary.component';
import { RouteDetailsComponent } from './route-details/route-details.component';
import { RouteComponent } from './route/route.component';
import { CitiesComponent } from './cities/cities.component';
import { RoadComponent } from './road/road.component';
import { RadarComponent } from './radar/radar.component';
import { TrafficJamComponent } from './traffic-jam/traffic-jam.component';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducer } from './reducers/reducers';
import { RouteAndTrafficCombination } from './classes/routeandtrafficcombo';

@NgModule({
    declarations: [
        AppComponent,
        PolylineDirective,
        MainviewComponent,
        HomeComponent,
        RouteSummaryComponent,
        RouteDetailsComponent,
        RouteComponent,
        CitiesComponent,
        RoadComponent,
        RadarComponent,
        TrafficJamComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        StoreModule.forRoot(appReducer),
        StoreRouterConnectingModule.forRoot(),
        StoreDevtoolsModule.instrument({
            name: 'TrafficAssist'
        }),
    ],
    providers: [
        NominatimService,
        OpenRouteService,
        AnwbService,
        OverpassService,
        TalkToMeBaby,
        FullScreen,
        CanDeactivatePage,
        RouteAndTrafficCombination
    ],
    bootstrap: [AppComponent],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
})

/**
 * @class AppModule
 */
export class AppModule { }
