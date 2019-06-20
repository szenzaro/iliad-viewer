import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { TextService } from 'src/app/services/text.service';
import { numberToOption, numberToOptions } from 'src/app/utils';

function optionsToFirstIdNumber(obs: Observable<{ id: string, label: string }[]>) {
  return obs.pipe(
    filter((x) => x.length > 0),
    map((x) => x[0]),
    map(({ id }) => +id),
  );
}

@Injectable({
  providedIn: 'root'
})
export class ManuscriptService {

  text = new BehaviorSubject<string>('homeric');

  chants = this.text.pipe(
    debounceTime(150),
    switchMap((text) => this.textService.getNumberOfChants(text)),
    map(numberToOptions),
  );

  chantInput = new Subject<number>();

  chant = merge(
    this.chantInput,
    optionsToFirstIdNumber(this.chants),
  ).pipe(
    debounceTime(150),
    filter((x) => !!x),
    distinctUntilChanged(),
    shareReplay(1),
  );

  pages = combineLatest([
    this.text.pipe(filter((x) => !!x)),
    this.chant,
  ]).pipe(
    debounceTime(150),
    switchMap(([text, chant]) => this.textService.getPageNumbers(text, chant)),
    map((pages) => pages.map(numberToOption)),
  );

  verses = this.chant.pipe(
    debounceTime(150),
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

  verseInput = new Subject<number>();

  private pageProxy = new Subject<number>();

  versesRange = combineLatest(this.pageProxy, this.text, this.chant).pipe(
    switchMap(([page, text, chant]) => this.textService.getVersesNumberFromPage(text, page, chant)),
  );

  private verseProxy = new Subject<number>();

  private pageToVerse = merge(
    combineLatest([
      this.versesRange,
      this.verseProxy,
    ]).pipe(
      map(([[l, r], v]) => v <= r && v >= l ? v : l),
    ),
    this.verseProxy,
  ).pipe(
    distinctUntilChanged(),
  );

  verse = merge(
    this.verseInput,
    optionsToFirstIdNumber(this.verses),
    this.pageToVerse,
  ).pipe(
    debounceTime(150),
    filter((x) => x !== NaN && x > 0),
    distinctUntilChanged(),
    tap((x) => this.verseProxy.next(x)),
    shareReplay(1),
  );

  pageInput = new Subject<number>();

  private verseToPage = combineLatest(this.text, this.chant, this.verse).pipe(
    switchMap(([text, chant, verse]) => this.textService.getPageFromVerse(text, chant, verse)),
    filter((x) => x !== NaN && x > 0),
  );

  page = merge(
    this.pageInput,
    optionsToFirstIdNumber(this.pages),
    this.verseToPage,
  ).pipe(
    debounceTime(150),
    filter((x) => x !== NaN && x > 0),
    distinctUntilChanged(),
    tap((n) => this.pageProxy.next(n)),
    shareReplay(1),
  );

  constructor(
    private readonly textService: TextService
  ) {
  }
}
