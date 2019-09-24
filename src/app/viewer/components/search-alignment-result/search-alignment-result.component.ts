import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';
import { TextService } from 'src/app/services/text.service';
import { Word } from 'src/app/utils/models';
import { InSubject } from '../../utils/InSubject';

@Component({
  selector: 'app-search-alignment-result',
  templateUrl: './search-alignment-result.component.html',
  styleUrls: ['./search-alignment-result.component.scss']
})
export class SearchAlignmentResultComponent {

  @Input() verseNumber: number;
  @Input() @InSubject() sourceWords: Word[];
  sourceWordsChange = new BehaviorSubject<Word[]>([]);
  @Input() @InSubject() targetWords: Word[];
  targetWordsChange = new BehaviorSubject<Word[]>([]);

  sourceVerse = this.sourceWordsChange.pipe(
    filter((x) => x !== undefined && x !== null && x.length > 0),
    switchMap((ws) => this.textService.getVerseFromNumber(ws[0].source, ws[0].chant, ws[0].verse)),
  );

  sourceIds = this.sourceWordsChange.pipe(
    map((ws) => ws.map(({ id }) => id)),
  );

  targetVerse = this.targetWordsChange.pipe(
    filter((x) => x !== undefined && x !== null && x.length > 0),
    switchMap((ws) => this.textService.getVerseFromNumber(ws[0].source, ws[0].chant, ws[0].verse)),
  );

  targetIds = this.targetWordsChange.pipe(
    map((ws) => ws.map(({ id }) => id)),
  );

  constructor(
    private textService: TextService,
  ) {
    this.targetVerse.subscribe(console.log);
  }
}
