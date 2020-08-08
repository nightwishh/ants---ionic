import { TestBed } from '@angular/core/testing';

import { GrdUsersService } from './grd-users.service';

describe('GrdUsersService', () => {
  let service: GrdUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrdUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
