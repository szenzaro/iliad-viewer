import { TestBed } from '@angular/core/testing';

import { ManuscriptService } from './manuscript.service';

describe('ManuscriptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManuscriptService = TestBed.inject(ManuscriptService);
    expect(service).toBeTruthy();
  });
});
