import { Injectable } from '@angular/core';
import { Map } from '../utils/index';
import { CacheService } from './cache.service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScholieService {

  scholie = this.cacheService.cachedGet<Map<Map<Map<Array<[boolean, string]>>>>>('./assets/data/scholie-page.json').pipe(
    map((x) => x),
  );

  constructor(
    private cacheService: CacheService,
  ) {
  }
}
