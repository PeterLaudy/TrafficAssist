import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NominatumService } from './services/nominatum.service';
import { HttpClientModule } from '@angular/common/http';
import { OpenrouteService } from './services/openroute.service';
import { AnwbService } from './services/anwb.service';
import { PolylineDirective } from './directives/polyline.directive';
import { OverpassService } from './services/overpass.service';
import { MainviewComponent } from './mainview/mainview.component';
import { HomeComponent } from './home/home.component';

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
        NominatumService,
        OpenrouteService,
        AnwbService,
        OverpassService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
