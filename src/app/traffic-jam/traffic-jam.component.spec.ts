import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficJamComponent } from './traffic-jam.component';

describe('TrafficJamComponent', () => {
    let component: TrafficJamComponent;
    let fixture: ComponentFixture<TrafficJamComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ TrafficJamComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TrafficJamComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
