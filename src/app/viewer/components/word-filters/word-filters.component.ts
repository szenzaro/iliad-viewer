import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Map, POS, POS_OP, PosFilter } from 'src/app/utils';

import { debounceTime, distinctUntilChanged, filter, map, scan, shareReplay, startWith } from 'rxjs/operators';

import { faBroom, faSearch } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, merge, Subject } from 'rxjs';

@Component({
  selector: 'app-word-filters',
  templateUrl: './word-filters.component.html',
  styleUrls: ['./word-filters.component.scss'],
})
export class WordFiltersComponent {

  faSearch = faSearch;
  faBroom = faBroom;
  filterItem = new EventEmitter<Map<boolean>>();
  currentFilter = this.filterItem.pipe(
    scan((x, y) => (Object.keys(y).length === 0 ? {} : { ...x, ...y })),
  );

  switchChange = new EventEmitter<boolean>();
  opChange = this.switchChange.pipe(
    map<boolean, POS_OP>((v) => (v ? 'and' : 'or')),
    startWith<POS_OP>('or')
  );

  private _pos: PosFilter;
  @Input() set pos(data: PosFilter) {
    this._pos = data;
    this.posChange.next(data);
  }
  get pos() { return this._pos; }
  posChange = new Subject<PosFilter>();

  @Input() disabled = false;
  @Output() filterChange = merge(
    this.posChange,
    combineLatest([
      this.currentFilter.pipe(
        map((currentFilter) => Object.keys(currentFilter).filter((k) => currentFilter[k]) as POS[]),
      ),
      this.opChange,
    ]).pipe(
      debounceTime(100),
      map(([pos, op]) => ({ op, pos } as PosFilter)),
    ),
  ).pipe(
    shareReplay(1),
  );

  @Input() submitBtn = false;
  @Output() submitFilter = new EventEmitter();

  filterSelected = (label: POS) => {
    return this.filterChange.pipe(
      filter((x) => !!x),
      distinctUntilChanged(),
      map((x) => x.pos.includes(label)),
      startWith(false),
    );
  }

  filterFromLabel(label: string, value: boolean): Map<boolean> {
    const obj = {};
    obj[label] = value;
    return obj;
  }

  genderFromLabel(label: string) {
    switch (label) {
      case 'Masculine':
        return 'M';
      case 'Feminine':
        return 'F';
      case 'Neutral':
        return 'N';
      default:
        return undefined;
    }
  }
}
