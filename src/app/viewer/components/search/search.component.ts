import { Component } from '@angular/core';
import { map, shareReplay, tap } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import { groupBy, Map } from 'src/app/utils';
import { Word } from 'src/app/utils/models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {

  resultsByText = this.searchService.results.pipe(
    map((x) => groupBy(x, 'source')),
    shareReplay(1),
  );

  results = this.resultsByText.pipe(
    tap(() => this.searchService.loading.next(true)),
    map((x) => {
      const keys = Object.keys(x);
      const m: Map<Map<Word[]>> = {};
      keys.forEach((k) => m[k] = groupBy(x[k], 'chant'));
      keys.forEach((text) => Object.keys(m[text])
        .forEach((chant) => m[text][chant] = m[text][chant].sort((w1, w2) => w1.verse - w2.verse)));
      return m;
    }),
    tap(() => this.searchService.loading.next(false)),
  );

  totalResultsPerText = this.resultsByText.pipe(
    map((x) => {
      const keys = Object.keys(x);
      const n: Map<number> = {};
      keys.forEach((text) => n[text] = Object.keys(x[text]).length);
      return n;
    }),
    shareReplay(1),
  );

  totalResults = this.totalResultsPerText.pipe(
    map((x) => Object.keys(x).reduce((a, b) => a + x[b], 0)),
  );

  constructor(
    public readonly searchService: SearchService,
  ) {
  }
}
