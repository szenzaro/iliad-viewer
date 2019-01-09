import { Component, Input } from '@angular/core';
import { TextService } from 'src/app/services/text.service';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';

import { numberToOptions } from 'src/app/utils';
import { InSubject } from '../../utils/InSubject';

@Component({
  selector: 'app-comparable-text',
  templateUrl: './comparable-text.component.html',
  styleUrls: ['./comparable-text.component.scss']
})
export class ComparableTextComponent {

  @Input() @InSubject() text: string;
  textChange = new BehaviorSubject<string>(undefined);

  @Input() @InSubject() chant: number;
  chantChange = new BehaviorSubject<number>(1);

  textsList = this.textService.getTextsList()
    .pipe(
      map(({ textsList }) => textsList),
    );

  loading = new BehaviorSubject<boolean>(true);

  verses = combineLatest(this.textChange, this.chantChange)
    .pipe(
      debounceTime(100),
      tap(() => this.loading.next(true)),
      filter(([text]) => !!text),
      switchMap(([text, chant]) => this.textService.getVerses(text, chant)),
      tap(() => this.loading.next(false)),
    );

  chantsNumber = this.textChange
    .pipe(
      switchMap((text) => this.textService.getNumberOfChants(text)),
      map(numberToOptions),
    );

  constructor(private textService: TextService) {
  }
}
