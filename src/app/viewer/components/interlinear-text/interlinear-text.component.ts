import { Component, Input, Output } from '@angular/core';
import { faListAlt, faThList } from '@fortawesome/free-solid-svg-icons';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

import { InSubject } from '../../utils/InSubject';

import { numberToOption } from 'src/app/utils';
import { Verse } from 'src/app/utils/models';
import { ManuscriptService } from '../../services/manuscript.service';

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

function versesMerge(greek: Verse[], paraphrase: Verse[], initial: Verse[] = []): Verse[] {
  if (greek.length === 0) {
    return initial.concat(paraphrase);
  }
  if (paraphrase.length === 0) {
    return initial.concat(greek);
  }

  if ((greek[0].n === 'f' || greek[0].n === 't') && greek.length > 1) {
    return versesMerge(greek.slice(2), paraphrase.slice(1), initial.concat(greek.slice(0, 2).concat([paraphrase[0]])));
  }
  return versesMerge(greek.slice(1), paraphrase.slice(1), initial.concat([greek[0], paraphrase[0]]));
}

@Component({
  selector: 'app-interlinear-text',
  templateUrl: './interlinear-text.component.html',
  styleUrls: ['./interlinear-text.component.scss']
})
export class InterlinearTextComponent {

  faThList = faThList;
  faListAlt = faListAlt;

  @Input() @InSubject() showHomeric;
  showHomericChange = new BehaviorSubject<boolean>(true);

  @InSubject() showParaphfrase;
  showParaphfraseChange = new BehaviorSubject<boolean>(true);

  @Input() @InSubject() text: string;
  @Output() textChange = new BehaviorSubject<string>(undefined);

  @Input() @InSubject() paraphrase: string;
  @Output() paraphraseChange = new BehaviorSubject<string>(undefined);

  chant = this.manuscriptService.chant.pipe(
    map(numberToOption),
  );

  page = this.manuscriptService.page.pipe(
    map(numberToOption),
  );

  verse = this.manuscriptService.verse.pipe(
    map(numberToOption),
  );

  loading = new BehaviorSubject<boolean>(true);

  verses = combineLatest([
    this.showHomericChange,
    this.showParaphfraseChange,
    this.manuscriptService.pageVerses,
  ]).pipe(
    debounceTime(150),
    tap(() => this.loading.next(true)),
    map(([showHomeric, showParaphfrase, [greek, paraph]]) => {
      const greekVerses = showHomeric ? greek : [];
      const paraphVerses = showParaphfrase ? paraph : [];

      if (greekVerses.length > 0 && paraphVerses.length > 0) {
        if (greekVerses[0].id < paraphVerses[0].id) {
          return versesMerge(greekVerses.slice(1), paraphVerses, [greekVerses[0]]);
        }
        if (greekVerses[0].id === paraphVerses[0].id) {
          return versesMerge(greekVerses, paraphVerses, []);
        }
        return versesMerge(paraphVerses, greekVerses, []);
      }
      return versesMerge(greekVerses, paraphVerses);
    }),
    tap(() => this.loading.next(false)),
  );

  constructor(
    readonly manuscriptService: ManuscriptService,
  ) {
  }
}
