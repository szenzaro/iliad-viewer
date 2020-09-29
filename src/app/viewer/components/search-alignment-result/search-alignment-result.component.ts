import { Component, Input } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { TextService } from 'src/app/services/text.service';
import { Word } from 'src/app/utils/models';
import { InSubject } from '../../utils/in-subject';

@Component({
  selector: 'app-search-alignment-result',
  templateUrl: './search-alignment-result.component.html',
  styleUrls: ['./search-alignment-result.component.scss']
})
export class SearchAlignmentResultComponent {

  @Input() showChant = false;
  @Input() @InSubject() book: number;
  private bookChange = new BehaviorSubject<number>(undefined);
  @Input() @InSubject() verseNumber: number;
  private verseNumberChange = new BehaviorSubject<number>(undefined);
  @Input() @InSubject() sourceText: string;
  private sourceTextChange = new BehaviorSubject<string>(undefined);
  @Input() @InSubject() sourceWords: Word[];
  sourceWordsChange = new BehaviorSubject<Word[]>([]);

  private _sourceOpenedWord: Word;
  get sourceOpenedWord() { return this._sourceOpenedWord; }
  set sourceOpenedWord(v: Word) { this._sourceOpenedWord = v === this._sourceOpenedWord ? undefined : v; }

  sourceVerse = combineLatest([
    this.bookChange,
    this.verseNumberChange,
    this.sourceTextChange,
  ]).pipe(
    filter(([c, v, t]) => c !== undefined && v !== undefined && !!t),
    switchMap(([c, v, t]) => this.textService.getVerseFromNumber(t, +c, v)),
  );

  sourceIds = this.sourceWordsChange.pipe(
    map((ws) => ws.map(({ id }) => id)),
  );

  constructor(
    private textService: TextService,
  ) {
  }
}
