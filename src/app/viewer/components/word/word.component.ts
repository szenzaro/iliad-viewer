import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faMars, faNeuter, faVenus } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { AlignmentKind, AlignmentService } from 'src/app/services/alignment.service';
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
  WordsFilter,
  Word_FILTERS,
} from 'src/app/utils';
import { Word } from 'src/app/utils/models';
import { InSubject } from '../../utils/in-subject';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {

  @InSubject() @Input() posHighlight: WordsFilter;
  posHighlightChange = new BehaviorSubject<WordsFilter>(undefined);
  @Input() highlighted = false;
  @InSubject() @Input() word: Word;
  wordChange = new BehaviorSubject<Word>(undefined);
  alignmentHighlightChange = new BehaviorSubject<AlignmentKind[]>([]);
  @Output() openWordId = new EventEmitter<string>();
  @Output() openWord = new EventEmitter<Word>();
  @Output() wordOver = new EventEmitter<string>();

  scholieKind = combineLatest([
    this.posHighlightChange.pipe(
      filter((x) => !!x),
    ),
    this.wordChange.pipe(
      filter((x) => !!x),
    ),
  ]).pipe(
    switchMap(([{ source }, w]) => w.id.startsWith('PARA')
      ? of('paraphrasescholie')
      : this.alignmentService.getWordScholieAlignmentKind(w, source, 'scholie')),
    map((x) => x),
    shareReplay(1),
  );

  scholieHighlighted = combineLatest([
    this.posHighlightChange.pipe(
      filter((x) => !!x),
    ),
    this.scholieKind.pipe(
      filter((x) => !!x),
    ),
    this.wordChange.pipe(
      filter((x) => !!x),
    ),
    this.alignmentService.homericScholieAlignmentsIDS,
    this.alignmentService.paraScholieIDS,
  ]).pipe(
    map(([wfilter, kind, w, hids, schPara]) =>
      (!!hids[w.id] && wfilter.wfilter.includes(kind as Word_FILTERS)) ||
      (wfilter.wfilter.includes('paraphrasescholie') && schPara.includes(w.id))
    ),
  );

  alignmentKind = combineLatest([
    this.posHighlightChange.pipe(
      filter((x) => !!x && !!x.alType),
    ),
    this.wordChange.pipe(
      filter((x) => !!x),
    ),
  ]).pipe(
    switchMap(([{ source, target, alType }, w]) => this.alignmentService.getWordAlignmentKind(w, source, target, alType)),
    shareReplay(1),
  );

  alignmentHighlighted = combineLatest([
    this.posHighlightChange.pipe(
      filter((x) => !!x),
    ),
    this.alignmentKind.pipe(
      filter((x) => !!x),
    ),
  ]).pipe(
    map(([wfilter, k]) => wfilter.wfilter.includes(k)),
    shareReplay(1),
  );

  faNeuter = faNeuter;
  faMars = faMars;
  faVenus = faVenus;

  constructor(
    public alignmentService: AlignmentService,
  ) {
  }

  get posHighlighted() {
    return !!this.posHighlight && !!this.posHighlight.wfilter && this.posHighlight.wfilter.length > 0 &&
      !!this.word &&
      !!this.word.data &&
      !!this.word.data.tag &&
      !this.posHighlight.source &&
      containsPOStoHighlight(this.word.data.tag, this.posHighlight);
  }

  get tagIsDefined() { return !!this.word && !!this.word.data && !!this.word.data.tag; }

  get posNeg() {
    return this.tagIsDefined && isNeg(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Neg');
  }

  get posConj() {
    return this.tagIsDefined && isConj(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Conj');
  }

  get posIntj() {
    return this.tagIsDefined && isIntj(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Intj');
  }

  get posAdjective() {
    return this.tagIsDefined && isAdjective(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Adjective');
  }
  get posParticle() {
    return this.tagIsDefined && isParticle(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Particle');
  }
  get posPreposition() {
    // tslint:disable-next-line: max-line-length
    return this.tagIsDefined && isPreposition(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Preposition');
  }
  get posArticle() {
    return this.tagIsDefined && isArticle(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Article');
  }
  get posAdverb() {
    return this.tagIsDefined && isAdverb(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Adverb');
  }
  get posName() {
    return this.tagIsDefined && isName(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Name');
  }
  get posAnthroponymic() {
    return this.tagIsDefined && isAnthroponymic(this.word.data.tag) &&
      !!this.posHighlight && this.posHighlight.wfilter.includes('Anthroponymic');
  }
  get posVerb() {
    return this.tagIsDefined && isVerb(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Verb');
  }
  get posPronoun() {
    return this.tagIsDefined && isPronoun(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Pronoun');
  }
  get posNum() {
    return this.tagIsDefined && isNum(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Num');
  }

  get posMasculine() {
    return this.tagIsDefined && isMasculine(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Masculine');
  }

  get posFeminine() {
    return this.tagIsDefined && isFeminine(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Feminine');
  }

  get posNeutral() {
    return this.tagIsDefined && isNeutral(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Neutral');
  }

  get posSingular() {
    return this.tagIsDefined && isSingular(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Singular');
  }

  get posPlural() {
    return this.tagIsDefined && isPlural(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Plural');
  }

  get posDual() {
    return this.tagIsDefined && isDual(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Dual');
  }

  get posNominative() {
    return this.tagIsDefined && isNominative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Nominative');
  }

  get posVocative() {
    return this.tagIsDefined && isVocative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Vocative');
  }

  get posAccusative() {
    return this.tagIsDefined && isAccusative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Accusative');
  }

  get posGenitive() {
    return this.tagIsDefined && isGenitive(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Genitive');
  }

  get posDative() {
    return this.tagIsDefined && isDative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Dative');
  }

  get posPresent() {
    return this.tagIsDefined && isPresent(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Present');
  }
  get posImperfect() {
    return this.tagIsDefined && isImperfect(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Imperfect');
  }
  get posFuture() {
    return this.tagIsDefined && isFuture(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Future');
  }
  get posAorist() {
    return this.tagIsDefined && isAorist(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Aorist');
  }
  get posPerfect() {
    return this.tagIsDefined && isPerfect(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Perfect');
  }
  get posPluperfect() {
    return this.tagIsDefined && isPluperfect(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Pluperfect');
  }
  get posFuturePerfect() {
    return this.tagIsDefined && isFuturePerfect(this.word.data.tag) && !
      !this.posHighlight && this.posHighlight.wfilter.includes('FuturePerfect');
  }
  get posIndicative() {
    return this.tagIsDefined && isIndicative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Indicative');
  }
  get posSubjunctive() {
    // tslint:disable-next-line: max-line-length
    return this.tagIsDefined && isSubjunctive(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Subjunctive');
  }
  get posImperative() {
    return this.tagIsDefined && isImperative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Imperative');
  }
  get posOptative() {
    return this.tagIsDefined && isOptative(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Optative');
  }
  get posInfinitive() {
    return this.tagIsDefined && isInfinitive(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Infinitive');
  }
  get posParticiple() {
    return this.tagIsDefined && isParticiple(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Participle');
  }
  get pos1st() {
    return this.tagIsDefined && is1st(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('1st');
  }
  get pos2nd() {
    return this.tagIsDefined && is2nd(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('2nd');
  }
  get pos3rd() {
    return this.tagIsDefined && is3rd(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('3rd');
  }
  get posToponym() {
    return this.tagIsDefined && isToponym(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Toponym');
  }
  get posPatronymic() {
    return this.tagIsDefined && isPatronymic(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Patronymic');
  }
  get posActive() {
    return this.tagIsDefined && isActive(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Active');
  }
  get posMiddle() {
    return this.tagIsDefined && isMiddle(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Middle');
  }
  get posPassive() {
    return this.tagIsDefined && isPassive(this.word.data.tag) && !!this.posHighlight && this.posHighlight.wfilter.includes('Passive');
  }
}
