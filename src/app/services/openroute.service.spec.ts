import { TestBed } from '@angular/core/testing';

import { OpenRouteService } from './openroute.service';

describe('OpenrouteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenRouteService = TestBed.get(OpenRouteService);
    expect(service).toBeTruthy();
  });
});
