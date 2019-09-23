import { Component } from '@angular/core';
import { map, shareReplay, tap } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import { groupBy, Map } from 'src/app/utils';
import { Word } from 'src/app/utils/models';
import { KeyValue } from '@angular/common';

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
    map((byText) => {
      const byChant: Map<Map<Word[]>> = {};
      const byVerse: Map<Map<Map<Word[]>>> = {};
      Object.keys(byText).forEach((t) => {
        byChant[t] = groupBy(byText[t], 'chant');
        byVerse[t] = {};
        Object.keys(byChant[t]).forEach((c) => {
          byVerse[t][c] = groupBy(byChant[t][c], 'verse');
          Object.keys(byVerse[t][c]).forEach((v) => byVerse[t][c][v] = byVerse[t][c][v].sort((w1, w2) => w1.verse - w2.verse));
        });
      });
      return byVerse;
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

  bookResNumber(v: Map<Word[]>): number {
    return Object.keys(v).map((k) => v[k].length).reduce((x, y) => x + y, 0);
  }

  keyNumOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return +a.key - +b.key;
  }
}
