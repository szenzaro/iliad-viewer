import { Component, EventEmitter, Input, Output } from '@angular/core';

import { WordsTranslationService } from 'src/app/services/words-translation.service';
import { WordsFilter, tagToDescription } from 'src/app/utils';
import { Verse, Word } from 'src/app/utils/models';

@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
})
export class VerseComponent {

  tagToDescription = tagToDescription;
  @Input() verse: Verse;
  @Input() highlight = false;
  @Input() wordDetails: Word;
  @Input() posHighlight: WordsFilter;
  @Input() highlightIds: string[] = [];
  @Output() openWord = new EventEmitter<Word>();
  @Output() verseClicked = new EventEmitter<number | 'f' | 't'>();
  @Output() wordOver = new EventEmitter<string>();

  constructor(
    private vocabulary: WordsTranslationService,
  ) {
  }

  isHighlighted(id: string): boolean {
    return (!!this.wordDetails && id === this.wordDetails.id) || (!!this.highlightIds && this.highlightIds.includes(id));
  }

  dataPanelIsOpen(dw: Word) {
    return !!this.verse.words.find((w) => w.id === dw.id);
  }

  getTranslationData(lemma: string) {
    return this.vocabulary.getTranslations(lemma);
  }
}
