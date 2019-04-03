import { Component, Input, Output } from '@angular/core';
import { faListAlt, faThList } from '@fortawesome/free-solid-svg-icons';

import { BehaviorSubject, combineLatest, forkJoin, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { TextService } from 'src/app/services/text.service';
import { numberToOption, numberToOptions } from 'src/app/utils';
import { InSubject } from '../../utils/InSubject';

function pairwiseMerge<T>(arr: T[], arr2: T[], initial: T[] = []): T[] {
  if (arr.length === 0) {
    return initial.concat(arr2);
  }
  if (arr2.length === 0) {
    return initial.concat(arr);
  }

  const i = initial.concat([arr[0], arr2[0]]);

  return pairwiseMerge(arr.slice(1), arr2.slice(1), i);
}

@Component({
  selector: 'app-interlinear-text',
  templateUrl: './interlinear-text.component.html',
  styleUrls: ['./interlinear-text.component.scss']
})
export class InterlinearTextComponent {

  faThList = faThList;
  faListAlt = faListAlt;

  @InSubject() showHomeric;
  showHomericChange = new BehaviorSubject<boolean>(true);

  @InSubject() showParaphfrase;
  showParaphfraseChange = new BehaviorSubject<boolean>(true);

  private firstPage = 1;

  @Input() @InSubject() page: number;
  @Output() pageChange = new BehaviorSubject<number>(this.firstPage); // TODO: check why on next/prev page it triggers 2 times

  @Input() @InSubject() text: string;
  @Output() textChange = new BehaviorSubject<string>(undefined);

  @Input() @InSubject() paraphrase: string;
  @Output() paraphraseChange = new BehaviorSubject<string>(undefined);

  @Input() @InSubject() chant: number;
  @Output() chantChange = new BehaviorSubject<number>(1);

  @Input() @InSubject() verse: number;
  @Output() verseChange = new BehaviorSubject<number>(1);

  versesChange = new BehaviorSubject<[number, number]>(undefined);

  chantPages = combineLatest(this.textChange.pipe(filter((x) => !!x)), this.chantChange)
    .pipe(
      debounceTime(150),
      switchMap(([text, chant]) => this.textService.getPageNumbers(text, chant)),
      tap((p) => this.pageChange.next(p[0])),
      map((pages) => pages.map(numberToOption)),
    );

  verseNumbers = this.chantChange
    .pipe(
      map((c) => {
        switch (c) {
          case 1: return 611;
          case 2: return 877;
          case 3: return 461;
        }
      }),
      distinctUntilChanged(),
      map(numberToOptions),
      tap((v) => this.verseChange.next(+v[0].id)),
    );

  selectedPage = merge(
    combineLatest(
      this.textChange.pipe(filter((x) => !!x)),
      this.chantChange.pipe(filter((x) => x !== undefined)),
      this.verseChange.pipe(filter((x) => x !== undefined)),
    ).pipe(
      debounceTime(150),
      switchMap(([text, chant, verse]) => this.textService.getPageFromVerse(text, chant, verse)),
      filter((p) => p !== 0),
      tap((p) => this.pageChange.next(p)),
    ),
    this.pageChange,
    this.chantPages.pipe(map((x) => +x[0].id)),
  ).pipe(
    distinctUntilChanged(),
  );

  selectedVerse = merge(
    this.verseChange,
    combineLatest(
      this.textChange.pipe(filter((x) => !!x)),
      this.chantChange.pipe(filter((x) => x !== undefined)),
      this.selectedPage.pipe(filter((x) => !!x)),
    ).pipe(
      distinctUntilChanged(),
      switchMap(([text, chant, page]) => this.textService.getVersesNumberFromPage(text, page - 1, chant)),
      filter((x) => !!x),
      map((data) => +data[1][0]),
      distinctUntilChanged(),
      tap((x) => this.verse = x),
    )
  );

  loading = new BehaviorSubject<boolean>(true);

  verses = combineLatest(
    this.textChange.pipe(filter((x) => !!x)),
    this.paraphraseChange.pipe(filter((x) => !!x)),
    this.chantChange.pipe(filter((x) => x !== undefined)),
    this.selectedPage.pipe(filter((x) => x !== undefined)),
    this.showHomericChange,
    this.showParaphfraseChange,
  ).pipe(
    debounceTime(100),
    switchMap(([text, paraphrase, chant, n, showHomeric, showParaphfrase]) =>
      this.textService.getVersesNumberFromPage(text, n - 1, chant)
        .pipe(
          tap(() => this.loading.next(true)),
          filter((x) => !!x),
          switchMap((range) => forkJoin(
            this.textService.getVerses(text, chant, [range[1][0] - 1, range[1][1]]),
            this.textService.getVerses(paraphrase, chant, [range[1][0] - 1, range[1][1]]),
          ).pipe(
            map(([greek, paraph]) => {
              const greekVerses = showHomeric
                ? greek.length > 0 && greek[0].n === 't' ? greek.slice(1) : greek
                : [];
              const paraphVerses = showParaphfrase ? paraph : [];

              const merged = pairwiseMerge(greekVerses, paraphVerses);
              return greek.length > 0 && greek[0].n === 't' ? [greek[0]].concat(merged) : merged;
            }),
          ),
          ),
          tap(() => this.loading.next(false)),
        ),
    ),
  );

  chantsNumber = this.textChange
    .pipe(
      switchMap((text) => this.textService.getNumberOfChants(text)),
      map(numberToOptions),
    );

  constructor(private textService: TextService) {
  }

  clickHomeric() {
    if (this.showHomeric && !this.showParaphfrase) {
      this.showParaphfrase = true;
    }
    this.showHomeric = !this.showHomeric;
  }

  clickParaphrase() {
    if (this.showParaphfrase && !this.showHomeric) {
      this.showHomeric = true;
    }
    this.showParaphfrase = !this.showParaphfrase;
  }
}
