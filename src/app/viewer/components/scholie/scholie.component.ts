import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ScholieService } from 'src/app/services/scholie.service';

import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { AlignmentService } from 'src/app/services/alignment.service';
import { numberToOption, WordsFilter } from 'src/app/utils';

@Component({
  selector: 'app-scholie',
  templateUrl: './scholie.component.html',
  styleUrls: ['./scholie.component.css']
})
export class ScholieComponent {
  scholie = this.scholieService.scholie;

  filter = new Subject<WordsFilter>();
  filterData = [
    {
      name: _T('Type'),
      data: [
        { id: 'homerscholie', kind: 'homerscholie', label: _T('Scholie in Genavensis') },
        { id: 'homernotscholie', kind: 'homernotscholie', label: _T('Scholie not in Genavensis') },
        { id: 'paraphrasescholie', kind: 'paraphrasescholie', label: _T('Paraphrase correspondent to Scholie') },
      ],
    },
  ];

  readonly leftWordOver = new Subject<string>();
  readonly rightWordOver = new Subject<string>();
  readonly type = new BehaviorSubject<'text' | 'table'>('text');
  readonly scholieViews = [
    { id: 'text', label: _T('Text') },
    { id: 'table', label: _T('Table') },
  ];
  @Input() scrollIndex = 0;

  al1 = this.leftWordOver.pipe(
    switchMap((x) => this.alignmentService.getScholieAlignment('homeric', 'scholie', x)),
  );
  al2 = this.rightWordOver.pipe(
    switchMap((x) => this.alignmentService.getScholieAlignment('scholie', 'homeric', x)),
  );

  chants1 = this.alignmentService.getScholieAlignmentChants('homeric', 'scholie').pipe(
    map((chants) => chants.map(numberToOption)),
  );

  chants2 = this.alignmentService.getScholieAlignmentChants('scholie', 'homeric').pipe(
    map((chants) => chants.map(numberToOption)),
  );

  sourceIds = merge(
    this.al1.pipe(map((x) => !!x ? x.source : [])),
    this.al2.pipe(map((x) => !!x ? x.target : [])),
  );

  targetIds = merge(
    this.al1.pipe(map((x) => !!x ? x.target : [])),
    this.al2.pipe(map((x) => !!x ? x.source : [])),
  );

  highlights = combineLatest([
    this.sourceIds,
    this.targetIds,
  ]).pipe(
    map(([source, target]) => ({ source, target })),
  );

  chant1 = new Subject<number>();
  chant2 = new Subject<number>();
  sourceChange = new Subject<string>();
  targetChange = new Subject<string>();

  // TODO
  filterWords = combineLatest([
    this.filter,
    this.sourceChange,
  ]).pipe(
    map(([f, source]) => ({ ...f, source, target: 'scholie' })),
    shareReplay(1),
  );

  // tslint:disable-next-line: no-any
  keyNumOrder = (a: KeyValue<number, any>, b: KeyValue<number, any>): number => +a.key - +b.key;

  constructor(
    private scholieService: ScholieService,
    private alignmentService: AlignmentService,
  ) {
  }
}
