import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { debounceTime, filter, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { AlignmentLabels, AlignmentService, AlignmentType } from 'src/app/services/alignment.service';
import { TextService } from 'src/app/services/text.service';
import { numberToOption, WordsFilter } from 'src/app/utils';
import { AlignmentHelpComponent } from '../help/alignment-help/alignment-help.component';

@Component({
  selector: 'app-aligned-texts',
  templateUrl: './aligned-texts.component.html',
  styleUrls: ['./aligned-texts.component.scss']
})
export class AlignedTextsComponent implements OnDestroy, AfterViewInit {

  readonly leftWordOver = new Subject<string>();
  readonly rightWordOver = new Subject<string>();
  readonly type = new BehaviorSubject<AlignmentType>('manual');
  readonly alignmentTypes = this.alignmentService.alignmentTypes.pipe(
    map((types) => types.map((id) => ({ id, label: this.ts.instant(AlignmentLabels[id]) }))),
  );
  @Input() scrollIndex = 0;

  AlignmentHelpComponent = AlignmentHelpComponent;

  al1 = combineLatest([
    this.leftWordOver,
    this.type,
  ]).pipe(
    switchMap(([x, type]) => this.alignmentService.getAlignment('homeric', 'paraphrase', x, type)),
  );
  al2 = combineLatest([
    this.rightWordOver,
    this.type]
  ).pipe(
    switchMap(([x, type]) => this.alignmentService.getAlignment('paraphrase', 'homeric', x, type)),
  );

  chants1 = this.type.pipe(
    switchMap((type) => this.alignmentService.getAlignmentChants('homeric', 'paraphrase', type)),
    map((chants) => chants.map(numberToOption)),
  );

  chants2 = this.type.pipe(
    switchMap((type) => this.alignmentService.getAlignmentChants('paraphrase', 'homeric', type)),
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

  filterData = [
    {
      name: _T('Type'),
      data: [
        { id: 'sub', kind: 'sub', label: _T('Substitution') },
        { id: 'eq', kind: 'eq', label: _T('Same Word') },
        { id: 'ins', kind: 'ins', label: _T('Added In Paraphrase') },
        { id: 'del', kind: 'del', label: _T('Removed from Homer') },
      ],
    },
  ];

  filter = new Subject<WordsFilter>();
  sourceChange = new Subject<string>();
  targetChange = new Subject<string>();
  filterWords = combineLatest([
    this.filter,
    this.sourceChange,
    this.targetChange,
    this.type,
  ]).pipe(
    map(([f, source, target, alType]) => ({ ...f, source, target, alType })),
    shareReplay(1),
  );
  unsubscribe = new Subject();

  constructor(
    readonly textService: TextService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private alignmentService: AlignmentService,
    private ts: TranslateService,
  ) {
    combineLatest([
      this.chant1.pipe(filter((x) => !isNaN(x))),
      this.chant2.pipe(filter((x) => !isNaN(x))),
    ])
      .pipe(
        takeUntil(this.unsubscribe),
        debounceTime(150),
      )
      .subscribe(([bl, br]) => {
        bl = !!bl ? bl : 1;
        br = !!br ? br : 1;
        const queryParams = {
          books: `${bl},${br}`,
        };
        this.router.navigate([this.router.url.split('?')[0]], { queryParams });
      }
      );
  }

  ngAfterViewInit() {
    this.activeRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe),
        debounceTime(50),
      )
      .subscribe((params) => {
        if (!!params.books) {
          const books = params.books.split(',');
          if (books.length === 2) {
            this.chant1.next(+books[0]);
            this.chant2.next(+books[1]);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
