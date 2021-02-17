import { TestBed } from '@angular/core/testing';

import { EmpTasksService } from './emp-tasks.service';

describe('EmpTasksService', () => {
  let service: EmpTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
