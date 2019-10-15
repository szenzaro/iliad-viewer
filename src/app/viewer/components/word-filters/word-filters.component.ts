import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Map, POS, POS_OP, PosFilter } from 'src/app/utils';

import { debounceTime, distinctUntilChanged, map, scan, shareReplay, startWith } from 'rxjs/operators';

import { faBroom, faSearch } from '@fortawesome/free-solid-svg-icons';
import { combineLatest } from 'rxjs';

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

  @Input() disabled = false;
  @Output() filterChange = combineLatest(
    this.currentFilter,
    this.opChange,
  ).pipe(
    debounceTime(100),
    map(([currentFilter, op]) => {
      const pos = Object.keys(currentFilter).filter((k) => currentFilter[k]) as POS[];
      return { op, pos } as PosFilter;
    }),
    shareReplay(1),
  );

  @Input() submitBtn = false;
  @Output() submitFilter = new EventEmitter();

  filterSelected = (label: POS) => {
    return this.filterChange.pipe(
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
