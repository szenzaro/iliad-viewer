import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faMars, faNeuter, faVenus } from '@fortawesome/free-solid-svg-icons';
import {
  containsPOStoHighlight,
  is1st,
  is2nd,
  is3rd,
  isAccusative,
  isActive,
  isAdjective,
  isAdverb,
  isAnthroponymic,
  isAorist,
  isArticle,
  isConj,
  isDative,
  isDual,
  isFeminine,
  isFuture,
  isFuturePerfect,
  isGenitive,
  isImperative,
  isImperfect,
  isIndicative,
  isInfinitive,
  isIntj,
  isMasculine,
  isMiddle,
  isName,
  isNeg,
  isNeutral,
  isNominative,
  isNum,
  isOptative,
  isParticiple,
  isParticle,
  isPassive,
  isPatronymic,
  isPerfect,
  isPluperfect,
  isPlural,
  isPreposition,
  isPresent,
  isPronoun,
  isSingular,
  isSubjunctive,
  isToponym,
  isVerb,
  isVocative,
  PosFilter,
} from 'src/app/utils';
import { Word } from 'src/app/utils/models';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {

  @Input() posHighlight: PosFilter;
  @Input() highlighted = false;
  @Input() word: Word;
  @Output() openWordId = new EventEmitter<string>();
  @Output() wordOver = new EventEmitter<string>();

  faNeuter = faNeuter;
  faMars = faMars;
  faVenus = faVenus;

  get posHighlighted() {
    return !!this.posHighlight && !!this.posHighlight.pos && this.posHighlight.pos.length > 0 &&
      !!this.word &&
      !!this.word.data &&
      !!this.word.data.tag &&
      containsPOStoHighlight(this.word.data.tag, this.posHighlight);
  }

  get tagIsDefined() { return !!this.word && !!this.word.data && !!this.word.data.tag; }

  get posNeg() {
    return this.tagIsDefined && isNeg(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Neg');
  }

  get posConj() {
    return this.tagIsDefined && isConj(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Conj');
  }

  get posIntj() {
    return this.tagIsDefined && isIntj(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Intj');
  }

  get posAdjective() {
    return this.tagIsDefined && isAdjective(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Adjective');
  }
  get posParticle() {
    return this.tagIsDefined && isParticle(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Particle');
  }
  get posPreposition() {
    return this.tagIsDefined && isPreposition(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Preposition');
  }
  get posArticle() {
    return this.tagIsDefined && isArticle(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Article');
  }
  get posAdverb() {
    return this.tagIsDefined && isAdverb(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Adverb');
  }
  get posName() {
    return this.tagIsDefined && isName(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Name');
  }
  get posAnthroponymic() {
    return this.tagIsDefined && isAnthroponymic(this.word.data.tag) &&
      !!this.posHighlight && this.posHighlight.pos.includes('Anthroponymic');
  }
  get posVerb() {
    return this.tagIsDefined && isVerb(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Verb');
  }
  get posPronoun() {
    return this.tagIsDefined && isPronoun(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Pronoun');
  }
  get posNum() {
    return this.tagIsDefined && isNum(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Num');
  }

  get posMasculine() {
    return this.tagIsDefined && isMasculine(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Masculine');
  }

  get posFeminine() {
    return this.tagIsDefined && isFeminine(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Feminine');
  }

  get posNeutral() {
    return this.tagIsDefined && isNeutral(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Neutral');
  }

  get posSingular() {
    return this.tagIsDefined && isSingular(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Singular');
  }

  get posPlural() {
    return this.tagIsDefined && isPlural(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Plural');
  }

  get posDual() {
    return this.tagIsDefined && isDual(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Dual');
  }

  get posNominative() {
    return this.tagIsDefined && isNominative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Nominative');
  }

  get posVocative() {
    return this.tagIsDefined && isVocative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Vocative');
  }

  get posAccusative() {
    return this.tagIsDefined && isAccusative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Accusative');
  }

  get posGenitive() {
    return this.tagIsDefined && isGenitive(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Genitive');
  }

  get posDative() {
    return this.tagIsDefined && isDative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Dative');
  }

  get posPresent() {
    return this.tagIsDefined && isPresent(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Present');
  }
  get posImperfect() {
    return this.tagIsDefined && isImperfect(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Imperfect');
  }
  get posFuture() {
    return this.tagIsDefined && isFuture(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Future');
  }
  get posAorist() {
    return this.tagIsDefined && isAorist(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Aorist');
  }
  get posPerfect() {
    return this.tagIsDefined && isPerfect(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Perfect');
  }
  get posPluperfect() {
    return this.tagIsDefined && isPluperfect(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Pluperfect');
  }
  get posFuturePerfect() {
    return this.tagIsDefined && isFuturePerfect(this.word.data.tag) && !
      !this.posHighlight && this.posHighlight.pos.includes('FuturePerfect');
  }
  get posIndicative() {
    return this.tagIsDefined && isIndicative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Indicative');
  }
  get posSubjunctive() {
    return this.tagIsDefined && isSubjunctive(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Subjunctive');
  }
  get posImperative() {
    return this.tagIsDefined && isImperative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Imperative');
  }
  get posOptative() {
    return this.tagIsDefined && isOptative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Optative');
  }
  get posInfinitive() {
    return this.tagIsDefined && isInfinitive(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Infinitive');
  }
  get posParticiple() {
    return this.tagIsDefined && isParticiple(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Participle');
  }
  get pos1st() {
    return this.tagIsDefined && is1st(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('1st');
  }
  get pos2nd() {
    return this.tagIsDefined && is2nd(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('2nd');
  }
  get pos3rd() {
    return this.tagIsDefined && is3rd(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('3rd');
  }
  get posToponym() {
    return this.tagIsDefined && isToponym(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Toponym');
  }
  get posPatronymic() {
    return this.tagIsDefined && isPatronymic(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Patronymic');
  }
  get posActive() {
    return this.tagIsDefined && isActive(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Active');
  }
  get posMiddle() {
    return this.tagIsDefined && isMiddle(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Middle');
  }
  get posPassive() {
    return this.tagIsDefined && isPassive(this.word.data.tag) && !!this.posHighlight && this.posHighlight.pos.includes('Passive');
  }
}
