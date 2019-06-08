import { Component, EventEmitter, Output, Input } from '@angular/core';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { InSubject } from '../../utils/InSubject';

import { Annotation, RecursivePartial } from 'src/app/utils/models';

@Component({
  selector: 'app-annotation-filter',
  templateUrl: './annotation-filter.component.html',
  styleUrls: ['./annotation-filter.component.scss'],
})
export class AnnotationFilterComponent {
  @InSubject() showHomer: boolean;
  @Output() showHomerChange = new BehaviorSubject<boolean>(true);

  @InSubject() showParaphrase: boolean;
  @Output() showParaphraseChange = new BehaviorSubject<boolean>(true);

  @Output() filterChange = new EventEmitter<RecursivePartial<Annotation>[]>();

  @Input() verseSelected;

  constructor() {
    combineLatest([
      this.showHomerChange,
      this.showParaphraseChange,
    ]).pipe(
      map(([h, p]) => {
        const filters: RecursivePartial<Annotation>[] = [
          h ? { type: 'verse', data: { type: 'homeric' } } as RecursivePartial<Annotation> : undefined,
          p ? { type: 'verse', data: { type: 'paraphrase' } } as RecursivePartial<Annotation> : undefined,
        ].filter((x) => !!x);
        return filters;
      })
    ).subscribe((x) => this.filterChange.next(x));
  }
}
