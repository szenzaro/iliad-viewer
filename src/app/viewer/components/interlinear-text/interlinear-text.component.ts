import { Component, Input } from '@angular/core';
import { faListAlt, faThList } from '@fortawesome/free-solid-svg-icons';

import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TextService } from 'src/app/services/text.service';


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

  showHomeric = true;
  showParaphfrase = true;

  @Input() set page(n: number) {
    if (n !== this.pageChanged.value) {
      this.pageChanged.next(n);
    }
  }
  get page() { return this.pageChanged.value; }
  pageChanged = new BehaviorSubject<number>(1);

  @Input() set text(txt: string) {
    if (txt !== this.textChanged.value) {
      this.textChanged.next(txt);
    }
  }
  get text() { return this.textChanged.value; }
  textChanged = new BehaviorSubject<string>(undefined);

  @Input() set paraphrase(p: string) {
    if (p !== this.paraphraseChanged.value) {
      this.paraphraseChanged.next(p);
    }
  }
  get paraphrase() { return this.paraphraseChanged.value; }
  paraphraseChanged = new BehaviorSubject<string>(undefined);

  @Input() set chant(c: number) {
    if (c !== this.chantChanged.value) {
      this.chantChanged.next(c);
    }
  }
  get chant() { return this.chantChanged.value; }
  chantChanged = new BehaviorSubject<number>(1);

  verses = combineLatest(this.textChanged, this.paraphraseChanged, this.chantChanged, this.pageChanged)
    .pipe(
      switchMap(([text, paraphrase, chant, n]) =>
        this.textService.getVersesNumberFromPage(text, chant, n - 1)
          .pipe(
            switchMap((range) => forkJoin(
              this.textService.getVerses(text, chant, [range[0] - 1, range[1]]),
              this.textService.getVerses(paraphrase, chant, [range[0] - 1, range[1]]),
            ).pipe(
              map(([greek, paraph]) => pairwiseMerge(greek, paraph)),
            ),
            ),
          ),
      )
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
