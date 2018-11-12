import { Component, Input } from '@angular/core';
import { faListAlt, faThList } from '@fortawesome/free-solid-svg-icons';

import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { TextService } from 'src/app/services/text.service';
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

function numberToOption(n) {
  return { id: `${n}`, label: `${n}` };
}

function numberToOptions(n: number) {
  return new Array(n).fill(undefined).map((_, i) => numberToOption(i + 1));
}

@Component({
  selector: 'app-interlinear-text',
  templateUrl: './interlinear-text.component.html',
  styleUrls: ['./interlinear-text.component.scss']
})
export class InterlinearTextComponent {

  faThList = faThList;
  faListAlt = faListAlt;

  showHomeric = true;
  showParaphfrase = true;

  @Input() @InSubject() page: number;
  pageChange = new BehaviorSubject<number>(1);

  @Input() @InSubject() text: string;
  textChange = new BehaviorSubject<string>(undefined);

  @Input() @InSubject() paraphrase: string;
  paraphraseChange = new BehaviorSubject<string>(undefined);

  @Input() @InSubject() chant: number;
  chantChange = new BehaviorSubject<number>(1);

  versesChange = new BehaviorSubject<[number, number]>(undefined);

  verses = combineLatest(this.textChange, this.paraphraseChange, this.chantChange, this.pageChange.pipe(distinctUntilChanged()))
    .pipe(
      switchMap(([text, paraphrase, chant, n]) =>
        this.textService.getVersesNumberFromPage(text, n - 1, chant)
          .pipe(
            switchMap((range) => forkJoin(
              this.textService.getVerses(text, chant, [range[1][0] - 1, range[1][1]]),
              this.textService.getVerses(paraphrase, chant, [range[1][0] - 1, range[1][1]]),
            ).pipe(
              map(([greek, paraph]) => pairwiseMerge(greek, paraph)),
            ),
            ),
          ),
      )
    );

  chantsNumber = this.textChange
    .pipe(
      switchMap((text) => this.textService.getNumberOfChants(text)),
      map(numberToOptions),
    );

  chantPages = combineLatest(this.textChange, this.chantChange)
    .pipe(
      switchMap(([text, chant]) => this.textService.getPageNumbers(text, chant)),
      map((pages) => pages.map(numberToOption)),
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
