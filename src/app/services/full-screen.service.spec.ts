import { TestBed } from '@angular/core/testing';
import { FullScreen } from './full-screen.service';

describe('FullScreenService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: FullScreen = TestBed.get(FullScreen);
        expect(service).toBeTruthy();
    });
});
