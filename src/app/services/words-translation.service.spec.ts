import { TestBed } from '@angular/core/testing';

import { WordsTranslationService } from './words-translation.service';

describe('WordsTranslationService', () => {
  let service: WordsTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordsTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
