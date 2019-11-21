import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TextService } from 'src/app/services/text.service';

import { BehaviorSubject, combineLatest, merge } from 'rxjs';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';

import { numberToOptions, PosFilter } from 'src/app/utils';
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

  textsList = this.textService.getTextsList()
    .pipe(
      map(({ textsList }) => textsList),
    );

  loading = new BehaviorSubject<boolean>(true);

  chantsNumber = this.textChange
    .pipe(
      filter((x) => !!x),
      switchMap((text) => this.textService.getNumberOfChants(text)),
      map(numberToOptions),
    );

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

  verses = combineLatest([this.textChange, this.actualChant.pipe(filter((x) => !isNaN(x)))])
    .pipe(
      debounceTime(100),
      tap(() => this.loading.next(true)),
      filter(([text]) => !!text),
      switchMap(([text, chant]) => this.textService.getVerses(text, chant)),
      map((verses) => verses.filter((v) => v.n !== 't' && v.n !== 'f')),
      tap(() => this.loading.next(false)),
    );

  @Input() @InSubject() posFilter: PosFilter;
  @Output() posFilterChange = new BehaviorSubject<PosFilter>({ op: 'or', pos: [] });

  constructor(
    private textService: TextService,
  ) {
  }
}
