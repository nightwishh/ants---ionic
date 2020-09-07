import { TestBed } from '@angular/core/testing';

import { BxCountersService } from './bx-counters.service';

describe('BxCountersService', () => {
  let service: BxCountersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BxCountersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
