import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faListAlt, faThList } from '@fortawesome/free-solid-svg-icons';

import { BehaviorSubject, combineLatest, forkJoin, merge } from 'rxjs';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';

import { TextService } from 'src/app/services/text.service';
import { InSubject } from '../../utils/InSubject';

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

  loading = new BehaviorSubject<boolean>(true);

  verses = combineLatest([
    this.manuscriptService.text,
    this.paraphraseChange.pipe(filter((x) => !!x)),
    this.manuscriptService.chant,
    this.showHomericChange,
    this.showParaphfraseChange,
    this.manuscriptService.versesRange,
    this.manuscriptService.page,
    this.manuscriptService.verse,
  ]).pipe(
    debounceTime(100),
    tap(() => this.loading.next(true)),
    switchMap(([text, paraphrase, chant, showHomeric, showParaphfrase, range]) =>
      forkJoin([
        this.textService.getVerses(text as string, chant as number, [range[0][0] - 1, range[0][1]]),
        this.textService.getVerses(paraphrase as string, chant as number, [range[1][0] - 1, range[1][1]]),
      ]).pipe(
        map(([greek, paraph]) => {
          const greekVerses = showHomeric
            ? greek.length > 0 && greek[0].n === 't' ? greek.slice(1) : greek
            : [];
          const paraphVerses = showParaphfrase ? paraph : [];

          const merged = greekVerses.length > 0 && paraphVerses.length > 0 && greekVerses[0].n <= paraphVerses[0].n
            ? pairwiseMerge(greekVerses, paraphVerses, greek.length > 0 && greek[0].n === 't' ? [greek[0]] : [])
            : pairwiseMerge(paraphVerses, greekVerses, greek.length > 0 && greek[0].n === 't' ? [greek[0]] : []);

          return merged;
        }),
      ),
    ),
    tap(() => this.loading.next(false)),
  );

  constructor(
    private textService: TextService,
    readonly manuscriptService: ManuscriptService,
  ) {
  }
}
