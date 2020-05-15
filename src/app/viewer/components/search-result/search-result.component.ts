import { Component, Input } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Word } from 'src/app/utils/models';

import { InSubject } from '../../utils/in-subject';

import { TextService } from 'src/app/services/text.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent {
  @Input() @InSubject() words: Word[];
  private wordsChange = new BehaviorSubject<Word[]>([]);

  private _openedWord: Word;
  get openedWord() { return this._openedWord; }
  set openedWord(v: Word) { this._openedWord = v === this._openedWord ? undefined : v; }

  wids = this.wordsChange.pipe(
    map((ws) => ws.map(({ id }) => id)),
  );

  result = this.wordsChange.pipe(
    filter((x) => x !== undefined && x !== null && x.length > 0),
    switchMap((ws) => this.textService.getVerseFromNumber(ws[0].source, ws[0].chant, ws[0].verse)),
  );

  constructor(
    private textService: TextService,
  ) {
  }
}
