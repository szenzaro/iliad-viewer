import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, merge, of, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { TextService } from 'src/app/services/text.service';
import { numberToOption, numberToOptions } from 'src/app/utils';

interface InputTriple {
  chant: number;
  page: number;
  verse: number;
}

@Injectable({
  providedIn: 'root'
})
export class ManuscriptService {

  homericID = new BehaviorSubject<string>('homeric');
  paraphraseID = new BehaviorSubject<string>('paraphrase');

  chantInput = new Subject<number>();
  pageInput = new Subject<number>();
  verseInput = new Subject<number>();

  private lastTriple = new BehaviorSubject<InputTriple>({ chant: 1, page: 1, verse: 1 });

  private chantChanged = combineLatest([
    this.chantInput.pipe(filter((x) => !!x)),
    this.lastTriple,
  ]).pipe(
    debounceTime(500),
    pairwise(),
    filter(([x, y]) => x[0] !== y[0]),
    map(([, y]) => y),
    filter(([c, { chant }]) => (chant !== c)),
    switchMap(([c]) => forkJoin([
      of(c),
      this.textService.getPageNumbers(c).pipe(map((ps) => ps[0])),
      this.textService.getPageNumbers(c).pipe(
        switchMap((ps) => this.textService.getVersesNumberFromPage(ps[0])),
        map((x) => !x || !x[0] ? 0 : x[0][0]),
      ),
    ])),
    map(([chant, page, verse]) => ({ chant, page, verse } as InputTriple)),
    shareReplay(1),
  );

  private pageChanged = combineLatest([
    this.pageInput.pipe(filter((x) => !!x)),
    this.lastTriple,
  ]).pipe(
    debounceTime(500),
    pairwise(),
    filter(([x, y]) => x[0] !== y[0]),
    map(([, y]) => y),
    filter(([p, { page }]) => page !== p),
    switchMap(([p, { chant, verse }]) => {
      const newChantAndPage = this.pagesByChant.pipe(
        map((m) => {
          if (!isNaN(chant) && m[`${chant}`].includes(p)) {
            return [chant, p];
          }
          const ch = Object.keys(m).find((n) => m[n].includes(p));
          return [+ch, p];
        }),
        shareReplay(1),
      );
      return forkJoin([
        newChantAndPage.pipe(
          map(([c]) => c),
          take(1),
        ),
        of(p),
        newChantAndPage.pipe(
          switchMap(([c, np]) => this.textService.getVersesNumberFromPage(np, c)),
          map((x) => x[0]),
          map(([l, t]) => l <= verse && verse <= t ? verse : l),
          take(1),
        ),
      ]);
    }),
    map(([chant, page, verse]) => ({ chant, page, verse } as InputTriple)),
    shareReplay(1),
  );

  private verseChanged = combineLatest([
    this.verseInput.pipe(filter((x) => !!x)),
    this.lastTriple,
  ]).pipe(
    debounceTime(500),
    pairwise(),
    filter(([x, y]) => x[0] !== y[0]),
    map(([, y]) => y),
    filter(([v, { verse }]) => verse !== v),
    switchMap(([v, { chant }]) => forkJoin([
      of(chant),
      this.textService.getPageFromVerse(chant, v),
      of(v),
    ])),
    map(([chant, page, verse]) => ({ chant, page, verse } as InputTriple)),
    shareReplay(1),
  );

  private triple = merge(
    this.chantChanged,
    this.pageChanged,
    this.verseChanged,
  ).pipe(
    tap((x) => this.lastTriple.next(x)),
    startWith({ chant: 1, page: 1, verse: 1 } as InputTriple),
    shareReplay(1),
  );

  chant = this.triple.pipe(
    map(({ chant }) => chant),
    shareReplay(1),
  );
  page = this.triple.pipe(
    map(({ page }) => page),
    shareReplay(1),
  );
  verse = this.triple.pipe(
    map(({ verse }) => verse),
    shareReplay(1),
  );

  chants = this.homericID.pipe(
    switchMap((text) => this.textService.getNumberOfChants(text)),
    map(numberToOptions),
  );

  allChants = this.textService.booksToPages.pipe(
    map((x) => Object.keys(x).map((n) => numberToOption(+n))),
  );

  private pagesByChant = this.textService.booksToPages;

  a = this.homericID.pipe(
    switchMap((h) => this.textService.getChantsPages(h)),
  );

  totalPages = this.textService.manifest.pipe(
    map(({ manuscriptPages }) => manuscriptPages),
    map(numberToOptions),
  );

  pages = combineLatest([
    this.chant,
    this.pagesByChant,
  ]).pipe(
    map(([c, m]) => !!c ? m[c] : []),
    map((pages) => pages.map(numberToOption)),
  );

  verses = combineLatest([
    this.chant,
    this.textService.versesByChant,
  ]).pipe(
    map(([c, vbc]) => vbc[c] || 0),
    distinctUntilChanged(),
    map(numberToOptions),
  );

  pageVersesRange = this.triple.pipe(
    debounceTime(150),
    mergeMap(({ chant, page }) => this.textService.getVersesNumberFromPage(page, chant)),
    filter((x) => !!x),
    shareReplay(1),
  );

  pageVerses = combineLatest([
    this.homericID,
    this.paraphraseID,
    this.triple,
    this.pageVersesRange,
  ]).pipe(
    switchMap(([h, p, { chant }, rng]) => forkJoin([
      this.textService.getVerses(h, chant, rng[0]),
      this.textService.getVerses(p, chant, rng[1]),
    ])),
  );

  constructor(
    private readonly textService: TextService,
  ) {
  }
}
