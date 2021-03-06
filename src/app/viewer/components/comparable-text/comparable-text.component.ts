import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TextService } from 'src/app/services/text.service';

import { BehaviorSubject, combineLatest, merge } from 'rxjs';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';

import { numberToOption, numberToOptions, WordsFilter } from 'src/app/utils';
import { InSubject } from '../../utils/in-subject';

@Component({
  selector: 'app-comparable-text',
  templateUrl: './comparable-text.component.html',
  styleUrls: ['./comparable-text.component.scss']
})
export class ComparableTextComponent {

  @Input() disableText = false;
  @Input() @InSubject() text: string;
  @Output() textChange = new BehaviorSubject<string>(undefined);

  @Input() @InSubject() chant: number;
  @Output() chantChange = new BehaviorSubject<number>(1);

  @Input() @InSubject() scrollIndex: number;
  @Output() scrollIndexChange = new BehaviorSubject<number>(0);
  @Output() wordOver = new EventEmitter<string>();

  @Input() highlightIds: string[];
  @Input() highlightIdsChange = new BehaviorSubject<string[]>([]);

  textsList = this.textService.textList;

  loading = new BehaviorSubject<boolean>(true);

  readonly chantsNumber = this.textChange
    .pipe(
      filter((x) => !!x),
      switchMap((text) => this.textService.getNumberOfChants(text)),
      map(numberToOptions),
    );

  @Input() chantOptions: Array<{ id: string, label: string }>;

  actualChant = merge(
    this.chantChange.pipe(
      filter((x) => !!x && !isNaN(x)),
      debounceTime(150),
    ),
    this.chantsNumber.pipe(map((x) => +x[0].id)),
  ).pipe(
    filter((x) => !isNaN(x) && x !== null),
    debounceTime(150),
  );

  optionChant = this.actualChant.pipe(
    map(numberToOption),
  );

  verses = combineLatest([this.textChange, this.actualChant.pipe(filter((x) => !isNaN(x)))])
    .pipe(
      debounceTime(100),
      tap(() => this.loading.next(true)),
      filter(([text]) => !!text),
      switchMap(([text, chant]) => this.textService.getVerses(text, chant)),
      map((verses) => verses.filter((v) => v.n !== 't' && v.n !== 'f')),
      tap(() => this.loading.next(false)),
    );

  isProseText = this.textChange.pipe(
    switchMap((x) => this.textService.isProseText(x)),
  );

  @Input() @InSubject() posFilter: WordsFilter;
  @Output() posFilterChange = new BehaviorSubject<WordsFilter>({ op: 'or', wfilter: [] });

  constructor(
    private textService: TextService,
  ) {
  }
}
