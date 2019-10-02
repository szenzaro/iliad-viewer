import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, filter, map, shareReplay, distinctUntilChanged } from 'rxjs/operators';
import { InSubject } from '../../utils/InSubject';

import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface ItemInfo {
  index?: number;
  first: boolean;
  last: boolean;
  next: { id: string, label: string };
  prev: { id: string, label: string };
}

@Component({
  selector: 'app-select-number',
  templateUrl: './select-number.component.html',
  styleUrls: ['./select-number.component.scss']
})
export class SelectNumberComponent {

  @Input() inline = true;
  @Input() label: string;
  @Input() showButtons = true;

  @Input() @InSubject() selection: { id: string, label: string };
  @Output() selectionChange = new BehaviorSubject<{ id: string, label: string }>(undefined);

  @Input() @InSubject() options: { id: string, label: string }[];
  optionsChange = new BehaviorSubject<{ id: string, label: string }[]>([]);

  selectedItem = this.selectionChange.pipe(
    filter((x) => !!x && +x.id !== NaN),
    debounceTime(150),
  );

  @Output() selectedNumber = this.selectedItem.pipe(
    filter((x) => !!x && +x.id !== NaN),
    map((x) => +x.id),
    distinctUntilChanged(),
  );

  selectedInfo = combineLatest([
    this.selectedItem,
    this.optionsChange.pipe(filter((x) => !!x)),
  ]).pipe(
    map(([item, options]) => {
      const index = options.findIndex((x) => x.id === item.id);
      return {
        index,
        first: index === 0,
        last: index === options.length - 1,
        next: options[index + 1],
        prev: options[index - 1],
      } as ItemInfo;
    }),
    shareReplay(1),
  );

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
}
