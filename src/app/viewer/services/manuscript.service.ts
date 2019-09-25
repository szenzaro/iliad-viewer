import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';
import { TextService } from 'src/app/services/text.service';
import { numberToOption, numberToOptions } from 'src/app/utils';

@Injectable({
  providedIn: 'root'
})
export class ManuscriptService {

  homericID = new BehaviorSubject<string>('homeric');
  paraphraseID = new BehaviorSubject<string>('paraphrase');

  chantInput = new Subject<number>();
  pageInput = new Subject<number>();
  verseInput = new Subject<number>();

  private verseProxy = new Subject<number>();

  chant = this.chantInput.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay(1),
  );

  pageFromVerse = combineLatest([this.chant, this.verseProxy]).pipe(
    debounceTime(150), // waits for verse to adapt its value after chant change
    mergeMap(([c, v]) => this.textService.getPageFromVerse(c, v)),
  );

  pages = this.chant.pipe(
    switchMap((chant) => this.textService.getPageNumbers(chant)),
    tap((ps) => this.pageInput.next(ps[0])),
    map((pages) => pages.map(numberToOption)),
  );

  page = merge(
    this.pageInput,
    this.pageFromVerse,
  ).pipe(
    filter((x) => x !== NaN && x !== null && x !== undefined),
    debounceTime(150),
    distinctUntilChanged(),
    shareReplay(1),
  );

  pageVersesRange = this.page.pipe(
    mergeMap((p) => this.textService.getVersesNumberFromPage(p)),
    tap((range) => this.verseInput.next(range[0][0])),
    shareReplay(1),
  );

  verse = combineLatest([
    this.verseInput,
    this.pageVersesRange.pipe(filter((x) => !!x)),
  ]).pipe(
    map(([v, range]) => range[0][0] <= v && v <= range[0][1] ? range[0][0] : v),
    distinctUntilChanged(),
    tap((v) => this.verseProxy.next(v)),
    shareReplay(1),
  );

  chants = this.homericID.pipe(
    switchMap((text) => this.textService.getNumberOfChants(text)),
    tap(() => this.chantInput.next(1)),
    map(numberToOptions),
  );

  private pagesByChant = this.homericID.pipe(
    switchMap((text) => this.textService.getChantsPages(text)),
  );

  private checkChant = combineLatest([
    this.pagesByChant,
    this.page,
    this.chant,
  ]).pipe(
    tap(([allPages, p, c]) => {
      const newChant = +Object.keys(allPages).find((key) => allPages[key].includes(p));
      if (newChant !== c) {
        this.chantInput.next(newChant);
      }
    })
  );

  verses = this.chant.pipe(
    map((c) => {
      switch (c) {
        case 1: return 611;
        case 2: return 877;
        case 3: return 461;
      }
    }),
    distinctUntilChanged(),
    tap(() => this.verseInput.next(1)),
    map(numberToOptions),
  );

  pageVerses = combineLatest([
    this.homericID,
    this.paraphraseID,
    this.chant,
    this.pageVersesRange,
  ]).pipe(
    switchMap(([h, p, c, rng]) => forkJoin([
      this.textService.getVerses(h, c, [rng[0][0] - 1, rng[0][1]]),
      this.textService.getVerses(p, c, [rng[1][0] - 1, rng[0][1]]),
    ])),
  );

  constructor(
    private readonly textService: TextService,
  ) {
    this.checkChant.subscribe();
  }
}
