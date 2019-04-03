import { TestBed } from '@angular/core/testing';

import { AnwbService } from './anwb.service';

describe('AnwbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnwbService = TestBed.get(AnwbService);
    expect(service).toBeTruthy();
  });
});
