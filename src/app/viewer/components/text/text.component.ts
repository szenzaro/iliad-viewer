import { Component, Input, Output, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, skip, tap } from 'rxjs/operators';
import { POS } from 'src/app/utils';
import { Verse } from 'src/app/utils/models';
import { InSubject } from '../../utils/InSubject';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  @Input() verses: Verse[] = [];
  @Input() highlight = false; // Highlight alternate verses
  @Input() showData = true;
  @Input() loading = true;
  @Input() posHighlight: POS[] = [];
  @Input() @InSubject() scrollIndex: number;
  @Output() scrollIndexChange = new BehaviorSubject<number>(0);

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  private _openedWordId: string;
  get openedWordId() { return this._openedWordId; }
  set openedWordId(v: string) { this._openedWordId = v === this._openedWordId ? undefined : v; }

  shouldHighlight(index: number, verse: Verse) {
    return this.highlight && index % 2 === 0 && verse.n !== 't';
  }

  scrollToIndex(index: number) {
    this.viewPort.scrollToIndex(index, 'smooth');
  }

  constructor() {
    this.scrollIndexChange.pipe(
      skip(1),
      tap(() => this.openedWordId = undefined),
      distinctUntilChanged(),
    ).subscribe((x: number) => this.scrollToIndex(x - 1));
  }
}
