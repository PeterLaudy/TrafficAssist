import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

@NgModule({
    declarations: [
        AppComponent,
        PolylineDirective,
        MainviewComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        NominatimService,
        OpenRouteService,
        AnwbService,
        OverpassService,
        TalkToMeBaby,
        FullScreen,
        CanDeactivatePage
    ],
    bootstrap: [AppComponent]
})

/**
 * @class AppModule
 */
export class AppModule { }
