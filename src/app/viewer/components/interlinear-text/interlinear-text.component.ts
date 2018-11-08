import { Component, Input } from '@angular/core';
import { faListAlt, faThList } from '@fortawesome/free-solid-svg-icons';

import { BehaviorSubject, combineLatest, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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

  verses = combineLatest(this.textChange, this.paraphraseChange, this.chantChange, this.pageChange)
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

  numberOfChants = this.textChange
    .pipe(
      switchMap((text) => this.textService.getNumberOfChants(text)),
    );

  numberOfPages = combineLatest(this.textChange, this.chantChange)
    .pipe(
      switchMap(([text, chant]) => this.textService.getNumberOfPages(text, chant)),
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
