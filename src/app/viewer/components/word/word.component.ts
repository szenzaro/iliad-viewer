import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  containsPOStoHighlight,
  isAdjective,
  isAdverb,
  isArticle,
  isName,
  isNum,
  isPronoun,
  isVerb,
  POS,
} from 'src/app/utils';
import { Word } from 'src/app/utils/models';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {

  @Input() posHighlight: POS[] = [];
  @Input() highlighted = false;
  @Input() word: Word;
  @Output() openWordId = new EventEmitter<string>();

  get posHighlighted() {
    return this.posHighlight.length > 0 &&
      !!this.word &&
      !!this.word.data &&
      !!this.word.data.tag &&
      containsPOStoHighlight(this.word.data.tag, this.posHighlight);
  }

  get tagIsDefined() { return !!this.word && !!this.word.data && !!this.word.data.tag; }

  get posAdjective() {
    return this.tagIsDefined && isAdjective(this.word.data.tag);
  }
  get posArticle() {
    return this.tagIsDefined && isArticle(this.word.data.tag);
  }
  get posAdverb() {
    return this.tagIsDefined && isAdverb(this.word.data.tag);
  }
  get posName() {
    return this.tagIsDefined && isName(this.word.data.tag);
  }
  get posVerb() {
    return this.tagIsDefined && isVerb(this.word.data.tag);
  }
  get posPronoun() {
    return this.tagIsDefined && isPronoun(this.word.data.tag);
  }
  get posNum() {
    return this.tagIsDefined && isNum(this.word.data.tag);
  }
}

