import { Component, Input } from '@angular/core';

import { POS, PosFilter } from 'src/app/utils';
import { Verse } from 'src/app/utils/models';

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
  @Input() posHighlight: PosFilter;

  private _openedWordId: string;
  get openedWordId() { return this._openedWordId; }
  set openedWordId(v: string) { this._openedWordId = v === this._openedWordId ? undefined : v; }

  shouldHighlight(index: number, verse: Verse) {
    return this.highlight && index % 2 === 0 && verse.n !== 't';
  }
}
