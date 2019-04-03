import { Component, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, AfterViewInit  {

    @ViewChildren('start') fromInput;

    from: string;
    to: string;

    constructor(private router: Router, private activatedRout: ActivatedRoute) { }

    ngOnInit(): void {
        this.activatedRout.paramMap.subscribe((route: ParamMap) => {
            this.from = route.get('from');
            this.to = route.get('to');
        });
    }

    ngAfterViewInit(): void {
        if (this.fromInput && this.fromInput.first) {
            this.fromInput.first.nativeElement.setSelectionRange(0, this.fromInput.first.nativeElement.value.length);
            this.fromInput.first.nativeElement.focus();
        }
    }

    changeFrom(address: string, event) {
        this.from = address;
        if (13 === event.keyCode) {
            this.getRoute();
        }
    }

    changeTo(address: string, event) {
        this.to = address;
        if (13 === event.keyCode) {
            this.getRoute();
        }
    }

    private getRoute() {
        this.router.navigateByUrl(`main/${this.from}/${this.to}`);
    }
}
