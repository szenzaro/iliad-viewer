import { KeyValue, Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, filter, map, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { SearchQuery, SearchService } from 'src/app/services/search.service';
import { groupBy, Map } from 'src/app/utils';
import { Word } from 'src/app/utils/models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements AfterViewInit, OnDestroy {

  loading = this.searchService.loading.pipe(debounceTime(150));
  currentQuery = this.searchService.queryString.pipe(
    tap((x) => console.log('current query:', x)),
    filter((x) => !!x),
    shareReplay(1)
  );

  sourceText = this.currentQuery.pipe(
    map((q) => q.alignment ? q.texts[0] : undefined),
    filter((x) => !!x),
  );

  targetText = this.currentQuery.pipe(
    map((q) => q.alignment ? q.texts[1] : undefined),
    filter((x) => !!x),
  );

  resultAlignment = this.searchService.results.pipe(
    map((x) => [
      Array.from(new Set(x.filter((a) => !!a).map(({ source }) => source))),
      groupBy(x, 'chant'),
    ] as [string[], Map<Word[]>]),
    map(([texts, byChant]) => {
      const chants = Object.keys(byChant);
      const res: Map<Map<[Word[], Word[]]>> = {};
      chants.forEach((c) => {
        res[c] = {};
        const byVerse = groupBy(byChant[c], 'verse');
        Object.keys(byVerse).forEach((v) => res[c][v] = [
          byVerse[v].filter((x) => x.source === texts[0]),
          byVerse[v].filter((x) => x.source === texts[1]),
        ]);
      });
      return res;
    }),
    tap(() => this.searchService.loading.next(false)),
  );

  resultsByText = this.searchService.results.pipe(
    map((x) => groupBy(x, 'source')),
    shareReplay(1),
  );

  perBookAlignmentResult = this.resultAlignment.pipe(
    map((r) => {
      const perBook: Map<number> = {};
      Object.keys(r).forEach((x) => perBook[x] = Object.keys(r[x]).length);
      return perBook;
    }),
    shareReplay(1),
  );

  totalAlignmentResults = this.perBookAlignmentResult.pipe(
    map((r) => Object.keys(r).map((k) => r[k]).reduce((a, b) => a + b, 0)),
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

  private defaultQuery = this.searchService.defaultQuery;

  private unsubscribe = new Subject();

  constructor(
    public readonly searchService: SearchService,
    private readonly location: Location,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
  ) {

    this.currentQuery
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((q) => {
        if (q.pos) {
          const queryParams = {
            op: q.posFilter.op,
            pos: q.posFilter.pos.join(','),
            texts: q.texts.join(','),
            alignment: q.alignment !== this.defaultQuery.alignment ? q.alignment : undefined,
          };
          this.router.navigate([this.router.url.split('?')[0]], { queryParams });
        }

        if (q.text && !q.pos) {
          const queryParams = {
            text: q.text,
            diacriticSensitive: q.diacriticSensitive !== this.defaultQuery.diacriticSensitive ? q.diacriticSensitive : undefined,
            caseSensitive: q.caseSensitive !== this.defaultQuery.caseSensitive ? q.caseSensitive : undefined,
            exactMatch: q.exactMatch !== this.defaultQuery.exactMatch ? q.exactMatch : undefined,
            alignment: q.alignment !== this.defaultQuery.alignment ? q.alignment : undefined,
            index: q.index !== this.defaultQuery.index ? q.index : undefined,
            texts: q.texts.join(','),
          };
          this.router.navigate([this.router.url.split('?')[0]], { queryParams });
        }
      });
  }

  ngAfterViewInit() {
    this.activeRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe),
        debounceTime(150),
      )
      .subscribe((params) => {
        if (!!params.op && !!params.pos) {
          const nq: SearchQuery = {
            ...this.defaultQuery,
            alignment: params.alignment || this.defaultQuery.alignment,
            pos: true,
            posFilter: {
              op: params.op,
              pos: params.pos.split(','),
            },
          };
          console.log(nq.posFilter);
          this.searchService.queryString.next(nq);
        }
        if (!!params.text) {
          const nq: SearchQuery = {
            ...this.searchService.defaultQuery,
            text: params.text,
            alignment: !params.alignment,
            texts: (!!params.text && params.texts.split(',')) || this.defaultQuery.texts,
            index: (!!params.index && params.index) || this.defaultQuery.index,
            diacriticSensitive: !!params.diacriticSensitive,
            caseSensitive: !!params.caseSensitive,
            exactMatch: !!params.exactMatch,
          };
          this.searchService.queryString.next(nq);
        }
      });
  }

  bookResNumber(v: Map<Word[]>): number {
    return Object.keys(v).map((k) => v[k].length).reduce((x, y) => x + y, 0);
  }

  keyNumOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => {
    return +a.key - +b.key;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
