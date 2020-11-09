import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';

import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScholieService {

  scholie = this.cacheService.cachedGet<Array<[number, number, string, Array<[boolean, string]>]>>('./assets/data/scholie-page.json').pipe(
    shareReplay(1),
  );

  filteredScholie = (chant: number | 'all', verse: number | 'all') => this.scholie.pipe(
    map((sch) => sch.filter((s) => (chant === 'all' || s[0] === chant) && (verse === 'all' || s[1] === verse))),
    shareReplay(1),
  )

  constructor(
    private cacheService: CacheService,
  ) {
  }
}
