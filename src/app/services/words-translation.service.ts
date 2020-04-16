import { Injectable } from '@angular/core';

import { map, shareReplay } from 'rxjs/operators';

import { Map } from '../utils/index';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class WordsTranslationService {
  private voc = this.cacheService.cachedGet<Map<string[]>>('./assets/data/voc.json').pipe(shareReplay(1));

  constructor(
    private cacheService: CacheService,
  ) {
  }

  getTranslations(word: string) {
    return this.voc.pipe(
      map((v) => v[word] ?? [])
    );
  }
}
