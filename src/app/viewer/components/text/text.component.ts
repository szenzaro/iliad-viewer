import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BehaviorSubject, Subscription } from 'rxjs';
import { skip, tap } from 'rxjs/operators';
import { WordsFilter } from 'src/app/utils';
import { Verse, Word } from 'src/app/utils/models';
import { InSubject } from '../../utils/in-subject';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnDestroy {
  @Input() verseClickable = true;
  @Input() verses: Verse[] = [];
  @Input() highlight = false; // Highlight alternate verses
  @Input() showData = true;
  @Input() loading = true;
  @Input() scrollableIndex = true;
  @Input() @InSubject() scrollIndex: number;
  @Output() scrollIndexChange = new BehaviorSubject<number>(0);
  @Output() wordOver = new EventEmitter<string>();

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
  @Input() posHighlight: WordsFilter;

  @Input() highlightIds: string[] = [];

  private _openedWord: Word;
  get openedWord() { return this._openedWord; }
  set openedWord(v: Word) { this._openedWord = v === this._openedWord ? undefined : v; }

  private scrollSubscription: Subscription;

  shouldHighlight(index: number, verse: Verse) {
    return this.highlight && index % 2 === 0 && verse.n !== 't';
  }

  scrollToIndex(index: number) {
    this.viewPort.scrollToIndex(index, 'smooth');
  }

  constructor(
  ) {
    this.scrollSubscription = this.scrollIndexChange.pipe(
      skip(1),
      tap(() => this.openedWord = undefined),
    ).subscribe((x: number) => { if (this.scrollableIndex) { this.scrollToIndex(x - 1); } });
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }
}
