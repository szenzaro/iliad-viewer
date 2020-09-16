import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScholieService {

  scholie = this.cacheService.cachedGet<Array<[number, number, string, Array<[boolean, string]>]>>('./assets/data/scholie-page.json').pipe(
    map((x) => x), // TODO: remove me
  );

  constructor(
    private cacheService: CacheService,
  ) {
  }
}
