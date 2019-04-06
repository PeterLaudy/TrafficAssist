import { TestBed } from '@angular/core/testing';

import { TalktomebabyService } from './talktomebaby.service';

describe('TalktomebabyService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: TalktomebabyService = TestBed.get(TalktomebabyService);
        expect(service).toBeTruthy();
    });
});
