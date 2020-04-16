import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WordsTranslationService } from 'src/app/services/words-translation.service';
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
  @Input() highlightIds: string[] = [];
  @Output() openWordId = new EventEmitter<string>();
  @Output() verseClicked = new EventEmitter<number | 'f' | 't'>();
  @Output() wordOver = new EventEmitter<string>();

  constructor(
    private vocabulary: WordsTranslationService,
  ){
  }

  isHighlighted(id: string): boolean {
    return (!!this.wordDetailsId && id === this.wordDetailsId) || (!!this.highlightIds && this.highlightIds.includes(id));
  }

  openedDataPanel(id: string) {
    return !!id && this.verse.words.find((w) => w.id === id);
  }

  getTranslationData(lemma: string) {
    return this.vocabulary.getTranslations(lemma);
  }
}
