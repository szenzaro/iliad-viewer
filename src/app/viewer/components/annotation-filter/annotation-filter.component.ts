import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @InSubject() showScholie: boolean;
  showScholieChange = new BehaviorSubject<boolean>(true);

  @InSubject() showRef: boolean;
  showRefChange = new BehaviorSubject<boolean>(true);

  @InSubject() showOrnament: boolean;
  showOrnamentChange = new BehaviorSubject<boolean>(true);

  @InSubject() showVaria: boolean;
  showVariaChange = new BehaviorSubject<boolean>(true);

  @InSubject() showTitle: boolean;
  showTitleChange = new BehaviorSubject<boolean>(true);

  @Output() filterChange = new BehaviorSubject<RecursivePartial<Annotation>[]>([
    { 'type': 'verse', 'data': { 'type': 'homeric' } },
    { 'type': 'verse', 'data': { 'type': 'paraphrase' } },
    { 'type': 'scholie' },
    { 'type': 'ref' },
    { 'type': 'ornament' },
    { 'type': 'varia' },
    { 'type': 'title' }
  ]);

  @Output() showAnnotationChange = new BehaviorSubject<boolean>(false);

  @Input() verseSelected;

  constructor() {
    combineLatest([
      this.showHomerChange,
      this.showParaphraseChange,
      this.showScholieChange,
      this.showRefChange,
      this.showOrnamentChange,
      this.showVariaChange,
      this.showTitleChange,
    ]).pipe(
      map(([h, p, s, r, o, v, t]) => {
        const filters: RecursivePartial<Annotation>[] = [
          h ? { type: 'verse', data: { type: 'homeric' } } as RecursivePartial<Annotation> : undefined,
          p ? { type: 'verse', data: { type: 'paraphrase' } } as RecursivePartial<Annotation> : undefined,
          s ? { type: 'scholie' } as RecursivePartial<Annotation> : undefined,
          r ? { type: 'ref' } as RecursivePartial<Annotation> : undefined,
          o ? { type: 'ornament' } as RecursivePartial<Annotation> : undefined,
          v ? { type: 'varia' } as RecursivePartial<Annotation> : undefined,
          t ? { type: 'title' } as RecursivePartial<Annotation> : undefined,
        ].filter((x) => !!x);
        return filters;
      })
    ).subscribe((x) => this.filterChange.next(x));
  }
}
