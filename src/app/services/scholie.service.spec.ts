import { TestBed } from '@angular/core/testing';

import { ScholieService } from './scholie.service';

describe('ScholieService', () => {
  let service: ScholieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScholieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
