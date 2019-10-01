import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, of, Subject } from 'rxjs';
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

@Injectable({
  providedIn: 'root'
})
export class ManuscriptService {

  homericID = new BehaviorSubject<string>('homeric');
  paraphraseID = new BehaviorSubject<string>('paraphrase');

  chantInput = new Subject<number>();
  pageInput = new Subject<number>();
  verseInput = new Subject<number>();

  private lastTriple = new BehaviorSubject<[number, number, number]>([1, 1, 1]);

  private triple = combineLatest([
    this.chantInput.pipe(distinctUntilChanged()),
    this.pageInput.pipe(distinctUntilChanged()),
    this.verseInput.pipe(distinctUntilChanged()),
    this.lastTriple,
  ]).pipe(
    debounceTime(150),
    pairwise(),
    filter(([[pc, pp, pv, pt], [cc, cp, cv, ct]]) => (pc !== cc || pp !== cp || pv !== cv)
      && (cv !== ct[2] || cp !== ct[1] || cc !== ct[0])),
    tap((x) => console.log('pair', x)),
    map(([[pc, pp, pv], [cc, cp, cv]]) => {
      if (pc !== cc) { // chant changed, update page
        console.log('chant changed!');
        return forkJoin([
          of(cc),
          this.textService.getPageNumbers(cc).pipe(map((ps) => ps[0])),
          of(cv),
        ]).pipe(
          shareReplay(1),
        );
      }
      if (pp !== cp) { // page changed, update verse and chant
        console.log('page changed!');
        const newPageAndChant = this.pagesByChant.pipe(
          map((m) => {
            if (m[`${cc}`].includes(cp)) {
              return [cc, cp];
            }
            const chant = Object.keys(m).find((n) => m[n].includes(cp));
            // return [+chant, m[chant][0]];
            return [+chant, cp];
          }),
          shareReplay(1),
        );
        //  TODO check going from page 41 to 40 using OSD arrows
        return forkJoin([
          newPageAndChant.pipe(
            map(([c]) => c),
            take(1),
          ),
          of(cp),
          newPageAndChant.pipe(
            switchMap(([c, p]) => this.textService.getVersesNumberFromPage(p, c)),
            map((x) => x[0]),
            map(([l, t]) => l <= cv && cv <= t ? cv : l),
            take(1),
          ),
        ]);
      }
      if (pv !== cv) { // verse changed, update page
        console.log('verse changed!');
        return forkJoin([
          of(cc),
          this.textService.getPageFromVerse(cc, cv),
          of(cv),
        ]);
      }
    }),
    switchMap((x) => x),
    startWith([1, 1, 1]),
    tap((x) => this.lastTriple.next(x)),
    tap((x) => console.log(x)),
    shareReplay(1),
  );

  chant = this.triple.pipe(
    debounceTime(150),
    map(([c]) => c),
    shareReplay(1),
  );
  page = this.triple.pipe(
    debounceTime(150),
    map(([_, p]) => p),
    shareReplay(1),
  );
  verse = this.triple.pipe(
    debounceTime(150),
    map((t) => t[2]),
    shareReplay(1),
  );

  chants = this.homericID.pipe(
    switchMap((text) => this.textService.getNumberOfChants(text)),
    map(numberToOptions),
  );

  private pagesByChant = this.homericID.pipe(
    switchMap((h) => this.textService.getChantsPages(h)),
  );

  pages = combineLatest([
    this.chant,
    this.pagesByChant,
  ]).pipe(
    map(([c, m]) => m[c]),
    map((pages) => pages.map(numberToOption)),
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
    map(numberToOptions),
  );

  pageVersesRange = this.triple.pipe(
    debounceTime(150),
    mergeMap(([c, p, _]) => this.textService.getVersesNumberFromPage(p, c)),
    filter((x) => !!x),
    shareReplay(1),
  );

  pageVerses = combineLatest([
    this.homericID,
    this.paraphraseID,
    this.triple,
    this.pageVersesRange,
  ]).pipe(
    switchMap(([h, p, [c, _], rng]) => forkJoin([
      this.textService.getVerses(h, c, [rng[0][0] - 1, rng[0][1]]),
      this.textService.getVerses(p, c, [rng[1][0] - 1, rng[0][1]]),
    ])),
  );

  constructor(
    private readonly textService: TextService,
  ) {
  }
}

