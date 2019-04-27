import { Component, OnInit } from '@angular/core';
import { NominatimService } from '../services/nominatim.service';
import { OpenRouteService } from '../services/openroute.service';
import { RouteModel } from '../classes/route.model';
import { AnwbService } from '../services/anwb.service';
import { GpsLocation, AccurateLocation } from '../classes/location.model';
import { OverpassService } from '../services/overpass.service';
import { ActivatedRoute } from '@angular/router';
import { timer, Subscription } from 'rxjs';
import { FullScreen } from '../services/full-screen.service';
import { PageUnload } from '../classes/page-unload';
import { AppState } from '../app-state';
import { Store } from '@ngrx/store';
import { LocationService } from '../services/location.service';

@Component({
    selector: 'app-mainview',
    templateUrl: './mainview.component.html',
    styleUrls: ['./mainview.component.css']
})

/**
 * The main view showing the route and other information
 */
export class MainviewComponent extends PageUnload implements OnInit {

    from: string;
    to: string;
    fromLoc: GpsLocation;
    toLoc: GpsLocation;

    anwbTimer: Subscription = null;
    myLocation: AccurateLocation;

    distance = 0;
    locationError = false;

    routeInfo: RouteModel = null;

    /**
     * Create the view
     * @param nominatum The service to get the GPS coordinates for an address
     * @param openRoute The service to calculate the route between two GPS coordinates
     * @param anwb The service to get the traffic information
     * @param overpass The service to get GeoLocation objects (cities in our case)
     * @param activatedRout The current route of the Angular routing service
     * @param fullScreen A simple wrapper around the browser fullscreen API
     * @param store The ngrx Store component for this app
     */
    constructor(
        private nominatum: NominatimService,
        private openRoute: OpenRouteService,
        private anwb: AnwbService,
        private overpass: OverpassService,
        private activatedRout: ActivatedRoute,
        public fullScreen: FullScreen,
        private locationService: LocationService,
        private store: Store<AppState>,
    ) {
        super();
    }

    /**
     * Here we kick of the services.
     */
    ngOnInit() {
        // First we get the API key for the navigation routing service.
        // By putting it in a seperate file, we can prevent it from being
        // stored in the GitHub repository.
        this.openRoute.getAPIKey().subscribe(key =>
            this.activatedRout.paramMap.subscribe(url => {
                // Clean any existing data to clear the page.
                this.cleanUp();
                // From the URL parameters, we get the from and to addresses.
                this.from = url.get('from');
                this.to = url.get('to');
                // We get the GPS coordinate for the from address.
                this.nominatum.getLocation(this.from)
                    .subscribe(result => {
                        // Get the result and start getting the route if the to location is known.
                        this.fromLoc = result;
                        if (null != this.toLoc) {
                            this.getRoute();
                        }
                    });
                // We get the GPS coordinate for the to address.
                this.nominatum.getLocation(this.to)
                    .subscribe(result => {
                        // Get the result and start getting the route if the from location is known.
                        this.toLoc = result;
                        if (null != this.fromLoc) {
                            this.getRoute();
                        }
                    });
            })
        );
    }

    /**
     * Method called just before the page is 'closed'.
     * Used to cleanup and unsubscribe any timers.
     * @returns False if the page can not be close, true otherwise.
     */
    canUnload(): boolean {
        this.cleanUp();
        return true;
    }

    /**
     * Release all references to local members and unsubscribe from all timers.
     */
    private cleanUp() {
        this.routeInfo = null;
        this.fromLoc = null;
        this.toLoc = null;
        if (null != this.anwbTimer) {
            this.anwbTimer.unsubscribe();
            this.anwbTimer = null;
        }
    }

    /**
     * Call the service to caclulate the route between the two given addresses.
     */
    getRoute() {
        this.openRoute.getRoute(this.fromLoc, this.toLoc)
            .subscribe(result => {
                this.routeInfo = result;
                // Get the traffic information.
                this.startGettingANWBInfo();
                // Get the cities in that bounding box
                this.getCitiesAndRouteDetails();
            });
    }

    /**
     * Start a timer which calls the service to get the traffic information.
     */
    private startGettingANWBInfo() {
        if (null != this.anwbTimer) {
            this.anwbTimer.unsubscribe();
        }
        this.anwbTimer = timer(1000, 30000).subscribe(response => {
            this.anwb.getTraficInfo().subscribe();
        });
    }

    /**
     * Call the service which gets all the cities in the area covering the calculated route,
     * as well as the detailed information of the route itself, which are basically all roads
     * intersecting with the route.
     * @todo Check if this can be made more efficient. It now supports two strategies:
     *       - It takes all coordinates at the beginning of a step with an instruction and request the roads
     *         in a small area around the first coordinate of those steps.
     *       - It takes all coordinates that make up the route and request the roads in an equally sized area
     *         around each of them them. This strategy takes much more time on the server side. On the 60 km
     *         route between Sittard and Venlo (NL) it takes 45 seconds as to 10 seconds for the other strategy.
     */
    getCitiesAndRouteDetails() {
        const detailLocations: GpsLocation[] = [];

        // Toggle the comment on the next line between /* and //* to switch between the two blocks of code.
        //*
        this.routeInfo.directions.forEach(direction => {
            if (direction.instruction) {
                detailLocations.push(this.routeInfo.gpsCoordinates[direction.coordinateIndex]);
            }
        });
        /*/
        this.routeInfo.gpsCoordinates.forEach(gps => {
            detailLocations.push(gps);
        });
        //*/
        this.overpass.getCitiesAndRouteDetails(detailLocations, this.routeInfo.gpsBBox)
            .subscribe();
    }

    startDemo() {
        this.locationService.startDemo();
    }
}
