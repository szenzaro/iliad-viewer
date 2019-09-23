import { Component, Input } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Word } from 'src/app/utils/models';

import { InSubject } from '../../utils/InSubject';

import { TextService } from 'src/app/services/text.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent {
  @Input() @InSubject() word: Word;
  private wordChange = new BehaviorSubject<Word>(undefined);

  private _openedWordId: string;
  get openedWordId() { return this._openedWordId; }
  set openedWordId(v: string) { this._openedWordId = v === this._openedWordId ? undefined : v; }

  result = this.wordChange.pipe(
    filter((x) => x !== undefined && x !== null),
    switchMap((w) => this.textService.getVerseFromNumber(w.source, w.chant, w.verse)),
  );

  constructor(
    private textService: TextService,
  ) {
  }
}
