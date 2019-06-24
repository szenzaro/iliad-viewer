import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PosFilter, tagToDescription } from 'src/app/utils';
import { Verse } from 'src/app/utils/models';


@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
})
export class VerseComponent {

  tagToDescription = tagToDescription;
  @Input() verse: Verse;
  @Input() highlight = false;
  @Input() wordDetailsId: string;
  @Input() posHighlight: PosFilter;
  @Output() openWordId = new EventEmitter<string>();
  @Output() verseClicked = new EventEmitter<number | 'f' | 't'>();
  @Output() wordOver = new EventEmitter<string>();

  openedDataPanel(id: string) {
    return !!id && this.verse.words.find((w) => w.id === id);
  }
}
