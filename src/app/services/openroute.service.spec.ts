import { TestBed } from '@angular/core/testing';

import { OpenrouteService } from './openroute.service';

describe('OpenrouteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenrouteService = TestBed.get(OpenrouteService);
    expect(service).toBeTruthy();
  });
});
