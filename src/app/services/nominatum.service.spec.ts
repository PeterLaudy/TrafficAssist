import { TestBed } from '@angular/core/testing';

import { NominatumService } from './nominatum.service';

describe('NominatumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NominatumService = TestBed.get(NominatumService);
    expect(service).toBeTruthy();
  });
});
