import { Component } from '@angular/core';
import { TextService } from 'src/app/services/text.service';
import { Verse } from 'src/app/utils/models';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-text-comparison',
  templateUrl: './text-comparison.component.html',
  styleUrls: ['./text-comparison.component.scss'],
})
export class TextComparisonComponent {

  textChanges = new BehaviorSubject<string>(undefined);
  chantChanged = new BehaviorSubject<number>(1);

  comparisonTextChanges = new BehaviorSubject<string>(undefined);
  comparisonChantChanged = new BehaviorSubject<number>(1);

  text: Observable<Verse[]> = combineLatest(this.textChanges, this.chantChanged)
    .pipe(
      filter(([text]) => !!text),
      switchMap(([text, chant]) => this.textService.getVerses(text, chant)),
    );

  comparisonText: Observable<Verse[]> = combineLatest(this.comparisonTextChanges, this.comparisonChantChanged)
    .pipe(
      filter(([text]) => !!text),
      switchMap(([text, chant]) => this.textService.getVerses(text, chant)),
    );


  constructor(private readonly textService: TextService) {
  }

}
