import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faMars, faNeuter, faVenus } from '@fortawesome/free-solid-svg-icons';
import {
  containsPOStoHighlight,
  isAccusative,
  isAdjective,
  isAdverb,
  isArticle,
  isDative,
  isDual,
  isFeminine,
  isGenitive,
  isMasculine,
  isName,
  isNeutral,
  isNominative,
  isNum,
  isPlural,
  isPronoun,
  isSingular,
  isVerb,
  isVocative,
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

  faNeuter = faNeuter;
  faMars = faMars;
  faVenus = faVenus;

  get posHighlighted() {
    return this.posHighlight.length > 0 &&
      !!this.word &&
      !!this.word.data &&
      !!this.word.data.tag &&
      containsPOStoHighlight(this.word.data.tag, this.posHighlight);
  }

  get tagIsDefined() { return !!this.word && !!this.word.data && !!this.word.data.tag; }

  get posAdjective() {
    return this.tagIsDefined && isAdjective(this.word.data.tag) && this.posHighlight.includes('Adjective');
  }
  get posArticle() {
    return this.tagIsDefined && isArticle(this.word.data.tag) && this.posHighlight.includes('Article');
  }
  get posAdverb() {
    return this.tagIsDefined && isAdverb(this.word.data.tag) && this.posHighlight.includes('Adverb');
  }
  get posName() {
    return this.tagIsDefined && isName(this.word.data.tag) && this.posHighlight.includes('Name');
  }
  get posVerb() {
    return this.tagIsDefined && isVerb(this.word.data.tag) && this.posHighlight.includes('Verb');
  }
  get posPronoun() {
    return this.tagIsDefined && isPronoun(this.word.data.tag) && this.posHighlight.includes('Pronoun');
  }
  get posNum() {
    return this.tagIsDefined && isNum(this.word.data.tag) && this.posHighlight.includes('Num');
  }

  get posMasculine() {
    return this.tagIsDefined && isMasculine(this.word.data.tag) && this.posHighlight.includes('Masculine');
  }

  get posFeminine() {
    return this.tagIsDefined && isFeminine(this.word.data.tag) && this.posHighlight.includes('Feminine');
  }

  get posNeutral() {
    return this.tagIsDefined && isNeutral(this.word.data.tag) && this.posHighlight.includes('Neutral');
  }

  get posSingular() {
    return this.tagIsDefined && isSingular(this.word.data.tag) && this.posHighlight.includes('Singular');
  }

  get posPlural() {
    return this.tagIsDefined && isPlural(this.word.data.tag) && this.posHighlight.includes('Plural');
  }

  get posDual() {
    return this.tagIsDefined && isDual(this.word.data.tag) && this.posHighlight.includes('Dual');
  }

  get posNominative() {
    return this.tagIsDefined && isNominative(this.word.data.tag) && this.posHighlight.includes('Nominative');
  }

  get posVocative() {
    return this.tagIsDefined && isVocative(this.word.data.tag) && this.posHighlight.includes('Vocative');
  }

  get posAccusative() {
    return this.tagIsDefined && isAccusative(this.word.data.tag) && this.posHighlight.includes('Accusative');
  }

  get posGenitive() {
    return this.tagIsDefined && isGenitive(this.word.data.tag) && this.posHighlight.includes('Genitive');
  }

  get posDative() {
    return this.tagIsDefined && isDative(this.word.data.tag) && this.posHighlight.includes('Dative');
  }
}

