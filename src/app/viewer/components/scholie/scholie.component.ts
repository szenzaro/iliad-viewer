import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';

import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { numberToOption, WordsFilter } from 'src/app/utils';
import { ScholieHelpComponent } from '../help/scholie-help/scholie-help.component';

import { TranslateService } from '@ngx-translate/core';
import { AlignmentService } from 'src/app/services/alignment.service';
import { ScholieService } from 'src/app/services/scholie.service';
import { TextService } from 'src/app/services/text.service';

@Component({
  selector: 'app-scholie',
  templateUrl: './scholie.component.html',
  styleUrls: ['./scholie.component.css']
})
export class ScholieComponent {
  private allOption = { id: 'all', label: this.ts.instant(_T('All')) };

  chants = this.textService.getChants('homeric').pipe(
    map((x) => x.map((n) => numberToOption(+n))),
    map((x) => [this.allOption, ...x])
  );
  chant = new BehaviorSubject<number | 'all'>('all');
  chantOption = this.chant.pipe(
    map((c) => c === 'all' ? this.allOption : numberToOption(c)),
  );

  verses = this.chant.pipe(
    switchMap((c) => c === 'all'
      ? this.textService.getAllVerses('homeric')
      : this.textService.getVerses('homeric', c)
    ),
    map((x) => x.filter(({ n }) => !isNaN(+n))),
    map((x) => x.map(({ n }) => numberToOption(+n))),
    map((x) => [this.allOption, ...x])
  );

  verse = new BehaviorSubject<number | 'all'>('all');
  verseOption = this.verse.pipe(
    map((v) => v === 'all' ? this.allOption : numberToOption(v)),
  );

  scholie = combineLatest([
    this.chant,
    this.verse,
  ]).pipe(
    switchMap(([c, v]) => this.scholieService.filteredScholie(c, v)),
  );

  ScholieHelpComponent = ScholieHelpComponent;
  filter = new Subject<WordsFilter>();
  filterData = [
    {
      name: _T('Type'),
      data: [
        { id: 'commentedinscholie', kind: 'commentedinscholie', label: _T('Commented in Scholie') },
        { id: 'correspondingscholie', kind: 'correspondingscholie', label: _T('Corresponding via Scholie D') },
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
    public textService: TextService,
    private ts: TranslateService,
  ) {
  }
}
