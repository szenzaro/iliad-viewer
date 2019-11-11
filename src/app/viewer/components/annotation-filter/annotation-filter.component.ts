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
    // { 'type': 'scholie' },   // TODO: uncomment me to show annotation commands
    // { 'type': 'ref' },       // TODO: uncomment me to show annotation commands
    // { 'type': 'ornament' },  // TODO: uncomment me to show annotation commands
    // { 'type': 'varia' },     // TODO: uncomment me to show annotation commands
    // { 'type': 'title' }      // TODO: uncomment me to show annotation commands
  ]);

  @Input() @InSubject() showAnnotation: boolean;
  @Output() showAnnotationChange = new BehaviorSubject<boolean>(false);

  @Input() verseSelected;

  constructor() {
    combineLatest([
      this.showHomerChange,
      this.showParaphraseChange,
      // this.showScholieChange,  // TODO: uncomment me to show annotation commands
      // this.showRefChange,      // TODO: uncomment me to show annotation commands
      // this.showOrnamentChange, // TODO: uncomment me to show annotation commands
      // this.showVariaChange,    // TODO: uncomment me to show annotation commands
      // this.showTitleChange,    // TODO: uncomment me to show annotation commands
    ]).pipe(
      map(([h, p]) => { // , s, r, o, v, t]) => { // TODO: uncomment me to show annotation commands
        const filters: RecursivePartial<Annotation>[] = [
          h ? { type: 'verse', data: { type: 'homeric' } } as RecursivePartial<Annotation> : undefined,
          p ? { type: 'verse', data: { type: 'paraphrase' } } as RecursivePartial<Annotation> : undefined,
          // s ? { type: 'scholie' } as RecursivePartial<Annotation> : undefined, // TODO: uncomment me to show annotation commands
          // r ? { type: 'ref' } as RecursivePartial<Annotation> : undefined,     // TODO: uncomment me to show annotation commands
          // o ? { type: 'ornament' } as RecursivePartial<Annotation> : undefined,// TODO: uncomment me to show annotation commands
          // v ? { type: 'varia' } as RecursivePartial<Annotation> : undefined,   // TODO: uncomment me to show annotation commands
          // t ? { type: 'title' } as RecursivePartial<Annotation> : undefined,   // TODO: uncomment me to show annotation commands
        ].filter((x) => !!x);
        return filters;
      })
    ).subscribe((x) => this.filterChange.next(x));
  }
}
