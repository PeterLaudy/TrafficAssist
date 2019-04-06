import { Component, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

/**
 * The view where the user can enter the addresses between which the route is calculated.
 */
export class HomeComponent implements OnInit, AfterViewInit  {

    @ViewChildren('start') fromInput;

    from: string;
    to: string;

    /**
     * @param router The Angular routing service
     * @param activatedRout The current route of the Angular routing service
     */
    constructor(private router: Router, private activatedRout: ActivatedRoute) { }

    /**
     * 
     */
    ngOnInit() {
        // Get the URL parameters containing the addresses between which the route must be calculated.
        this.activatedRout.paramMap.subscribe((route: ParamMap) => {
            this.from = route.get('from');
            this.to = route.get('to');
        });
    }

    /**
     * Focus the from address and select all text in it after loading this page.
     */
    ngAfterViewInit(): void {
        if (this.fromInput && this.fromInput.first) {
            this.fromInput.first.nativeElement.setSelectionRange(0, this.fromInput.first.nativeElement.value.length);
            this.fromInput.first.nativeElement.focus();
        }
    }

    /**
     * Event handler for the key-up event on the input element to enter the from address
     * @param address The value of the input element where the from address can be entered
     * @param event The event containing the information about the key-up event
     */
    changeFrom(address: string, event) {
        this.from = address;
        // The ENTER or RETURN key will take us to the main view where the route is shown.
        if (13 === event.keyCode) {
            this.getRoute();
        }
    }

    /**
     * Event handler for the key-up event on the input element to enter the to address
     * @param address The value of the input element where the to address can be entered
     * @param event The event containing the information about the key-up event
     */
    changeTo(address: string, event) {
        this.to = address;
        // The ENTER or RETURN key will take us to the main view where the route is shown.
        if (13 === event.keyCode) {
            this.getRoute();
        }
    }

    /**
     * Load the main view which will calculate the route between the given addresses.
     */
    private getRoute() {
        this.router.navigateByUrl(`main/${this.from}/${this.to}`);
    }
}
