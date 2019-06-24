import { Component, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, skip, tap } from 'rxjs/operators';
import { POS, PosFilter } from 'src/app/utils';
import { Verse } from 'src/app/utils/models';
import { InSubject } from '../../utils/InSubject';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnDestroy {
  @Input() verses: Verse[] = [];
  @Input() highlight = false; // Highlight alternate verses
  @Input() showData = true;
  @Input() loading = true;
  @Input() scrollableIndex = true;
  @Input() @InSubject() scrollIndex: number;
  @Output() scrollIndexChange = new BehaviorSubject<number>(0);

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
  @Input() posHighlight: PosFilter;

  private _openedWordId: string;
  get openedWordId() { return this._openedWordId; }
  set openedWordId(v: string) { this._openedWordId = v === this._openedWordId ? undefined : v; }

  private scrollSubscription: Subscription;

  shouldHighlight(index: number, verse: Verse) {
    return this.highlight && index % 2 === 0 && verse.n !== 't';
  }

  scrollToIndex(index: number) {
    this.viewPort.scrollToIndex(index, 'smooth');
  }

  constructor() {
    this.scrollSubscription = this.scrollIndexChange.pipe(
      skip(1),
      tap(() => this.openedWordId = undefined),
    ).subscribe((x: number) => { if (this.scrollableIndex) { this.scrollToIndex(x - 1); } });
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }
}
