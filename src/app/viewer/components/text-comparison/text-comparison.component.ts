import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { PosFilter } from 'src/app/utils';

@Component({
  selector: 'app-text-comparison',
  templateUrl: './text-comparison.component.html',
  styleUrls: ['./text-comparison.component.scss'],
})
export class TextComparisonComponent implements AfterViewInit, OnDestroy {
  @Input() scrollIndex = 0;
  showText = true;
  chant1 = new Subject<number>();
  chant2 = new Subject<number>();
  text1 = new BehaviorSubject<string>('homeric');
  text2 = new BehaviorSubject<string>('paraphrase');

  private _filter: PosFilter;
  set filter(f: PosFilter) {
    this._filter = f;
    this.filterChange.next(f);
  }
  get filter() { return this._filter; }
  filterChange = new Subject<PosFilter>();

  unsubscribe = new Subject();

  constructor(
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
  ) {
    combineLatest([
      this.chant1.pipe(filter((x) => x !== null && !isNaN(x)), distinctUntilChanged()),
      this.chant2.pipe(filter((x) => x !== null && !isNaN(x)), distinctUntilChanged()),
      this.text1.pipe(filter((x) => !!x), distinctUntilChanged()),
      this.text2.pipe(filter((x) => !!x), distinctUntilChanged()),
      this.filterChange.pipe(filter((x) => !!x), distinctUntilChanged()),
    ]).pipe(
      takeUntil(this.unsubscribe),
      debounceTime(250),
    ).subscribe(([bl, br, txtl, txtr, poss]) => {
      bl = !!bl ? bl : 1;
      br = !!br ? br : 1;
      const queryParams = {
        books: `${bl},${br}`,
        texts: `${txtl},${txtr}`,
        op: poss.op,
        pos: poss.pos.join(','),
      };
      this.router.navigate([this.router.url.split('?')[0]], { queryParams });
    });
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
        if (!!params.texts) {
          const texts = params.texts.split(',');
          if (texts.length === 2) {
            this.text1.next(texts[0]);
            this.text2.next(texts[1]);
          }
        }

        if (!!params.pos && !!params.op) {
          this.filterChange.next({ op: params.op, pos: params.pos.split(',') });
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
