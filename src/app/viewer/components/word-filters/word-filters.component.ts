import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Map, WordsFilter, Word_FILTERS, WORD_FILTER_OP } from 'src/app/utils';

import { debounceTime, distinctUntilChanged, filter, map, scan, shareReplay, startWith } from 'rxjs/operators';

import { KeyValue } from '@angular/common';
import { faBroom, faSearch } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';

import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';
import { AlignmentType } from 'src/app/services/alignment.service';
import { InSubject } from '../../utils/in-subject';

export interface PillData { kind: string; label: string; gender?: string; id: string; }

@Component({
  selector: 'app-word-filters',
  templateUrl: './word-filters.component.html',
  styleUrls: ['./word-filters.component.scss'],
})
export class WordFiltersComponent {

  faSearch = faSearch;
  faBroom = faBroom;
  filterItem = new EventEmitter<Map<boolean>>();
  currentFilter = this.filterItem.pipe(
    scan((x, y) => (Object.keys(y).length === 0 ? {} : { ...x, ...y })),
  );

  switchChange = new EventEmitter<boolean>();
  opChange = this.switchChange.pipe(
    map<boolean, WORD_FILTER_OP>((v) => (v ? 'and' : 'or')),
    startWith<WORD_FILTER_OP>('or')
  );

  private _pos: WordsFilter;
  @Input() set pos(data: WordsFilter) {
    this._pos = data;
    this.posChange.next(data);
  }
  get pos() { return this._pos; }
  posChange = new Subject<WordsFilter>();

  @InSubject() @Input() source: string;
  sourceChange = new BehaviorSubject<string>(undefined);
  @InSubject() @Input() target: string;
  targetChange = new BehaviorSubject<string>(undefined);
  @InSubject() @Input() alType: string;
  alTypeChange = new BehaviorSubject<AlignmentType | undefined>(undefined);

  @Input() disabled = false;
  @Output() filterChange = merge(
    this.posChange,
    combineLatest([
      this.currentFilter.pipe(
        map((currentFilter) => Object.keys(currentFilter).filter((k) => currentFilter[k]) as Word_FILTERS[]),
      ),
      this.opChange,
      this.sourceChange,
      this.targetChange,
      this.alTypeChange,
    ]).pipe(
      debounceTime(100),
      map(([wfilter, op, source, target, alType]) => ({ op, wfilter, source, target, alType } as WordsFilter)),
    ),
  ).pipe(
    shareReplay(1),
  );

  @Input() submitBtn = false;
  @Output() submitFilter = new EventEmitter();

  @Input() pillsData: Array<{ name: string, data: PillData[] }> = [
    {
      name: _T('Category'),
      data: [
        { kind: 'adjective', label: _T('Adjective'), id: 'Adjective' },
        { kind: 'article', label: _T('Article'), id: 'Article' },
        { kind: 'particle', label: _T('Particle'), id: 'Particle' },
        { kind: 'preposition', label: _T('Preposition'), id: 'Preposition' },
        { kind: 'adverb', label: _T('Adverb'), id: 'Adverb' },
        { kind: 'name', label: _T('Name'), id: 'Name' },
        { kind: 'anthroponymic', label: _T('Anthroponymic'), id: 'Anthroponymic' },
        { kind: 'toponym', label: _T('Toponym'), id: 'Toponym' },
        { kind: 'patronymic', label: _T('Patronymic'), id: 'Patronymic' },
        { kind: 'pronoun', label: _T('Pronoun'), id: 'Pronoun' },
        { kind: 'verb', label: _T('Verb'), id: 'Verb' },
        { kind: 'num', label: _T('Num'), id: 'Num' },
        { kind: 'neg', label: _T('Negation'), id: 'Neg' },
        { kind: 'conj', label: _T('Conjunction'), id: 'Conj' },
        { kind: 'intj', label: _T('Interjection'), id: 'Intj' },
      ],
    },
    {
      name: _T('Gender'),
      data: [
        { kind: 'masculine', label: _T('Masculine'), gender: 'M', id: 'Masculine' },
        { kind: 'feminine', label: _T('Feminine'), gender: 'F', id: 'Feminine' },
        { kind: 'neutral', label: _T('Neutral'), gender: 'N', id: 'Neutral' },
      ],
    },
    {
      name: _T('Cardinality'),
      data: [
        { kind: 'singular', label: _T('Singular'), id: 'Singular' },
        { kind: 'plural', label: _T('Plural'), id: 'Plural' },
        { kind: 'dual', label: _T('Dual'), id: 'Dual' },
      ],
    },
    {
      name: _T('Cases'),
      data: [
        { kind: 'nominative', label: _T('Nominative'), id: 'Nominative' },
        { kind: 'vocative', label: _T('Vocative'), id: 'Vocative' },
        { kind: 'accusative', label: _T('Accusative'), id: 'Accusative' },
        { kind: 'genitive', label: _T('Genitive'), id: 'Genitive' },
        { kind: 'dative', label: _T('Dative'), id: 'Dative' },
      ],
    },
    {
      name: _T('Tense'),
      data: [
        { kind: 'present', label: _T('Present'), id: 'Present' },
        { kind: 'imperfect', label: _T('Imperfect'), id: 'Imperfect' },
        { kind: 'future', label: _T('Future'), id: 'Future' },
        { kind: 'aorist', label: _T('Aorist'), id: 'Aorist' },
        { kind: 'perfect', label: _T('Perfect'), id: 'Perfect' },
        { kind: 'pluperfect', label: _T('Pluperfect'), id: 'Pluperfect' },
        { kind: 'future-perfect', label: _T('Future perfect'), id: 'FuturePerfect' },
      ],
    },
    {
      name: _T('Mood'),
      data: [
        { kind: 'indicative', label: _T('Indicative'), id: 'Indicative' },
        { kind: 'subjunctive', label: _T('Subjunctive'), id: 'Subjunctive' },
        { kind: 'imperative', label: _T('Imperative'), id: 'Imperative' },
        { kind: 'optative', label: _T('Optative'), id: 'Optative' },
        { kind: 'infinitive', label: _T('Infinitive'), id: 'Infinitive' },
        { kind: 'participle', label: _T('Participle'), id: 'Participle' },
      ],
    },
    {
      name: _T('Voice'),
      data: [
        { kind: 'active', label: _T('Active'), id: 'Active' },
        { kind: 'middle', label: _T('Middle'), id: 'Middle' },
        { kind: 'passive', label: _T('Passive'), id: 'Passive' },
      ],
    },
    {
      name: _T('Person'),
      data: [
        { kind: 'first-person', label: _T('1st'), id: '1st' },
        { kind: 'second-person', label: _T('2nd'), id: '2nd' },
        { kind: 'third-person', label: _T('3rd'), id: '3rd' },
      ],
    },
  ];

  originalOrder = (_a: KeyValue<number, string>, _b: KeyValue<number, string>): number => {
    return 0;
  }

  nextFilterItem(event: boolean, id: string) {
    const o = {};
    o[id] = event;
    this.filterItem.next(o);
  }

  filterSelected = (label: Word_FILTERS) => {
    return this.filterChange.pipe(
      filter((x) => !!x),
      distinctUntilChanged(),
      map((x) => x.wfilter.includes(label)),
      startWith(false),
    );
  }

  filterFromLabel(label: string, value: boolean): Map<boolean> {
    const obj = {};
    obj[label] = value;
    return obj;
  }

  genderFromId(id: string) {
    const foundLabels = this.pillsData
      .map((x) => x.data.find((d) => d.id === id)?.gender)
      .filter((x) => !!x);
    const gender = foundLabels.length === 1 ? foundLabels[0] : undefined;
    switch (gender) {
      case 'masculine': return 'M';
      case 'feminine': return 'F';
      case 'neutral': return 'N';
      default: return undefined;
    }
  }

  labelFromId(id: string) {
    const foundLabels = this.pillsData
      .map((x) => x.data.find((d) => d.id === id)?.label)
      .filter((x) => !!x);

    if (id === 'FuturePerfect') {
      console.log(foundLabels);
    }
    return foundLabels.length === 1 ? foundLabels[0] : id;
  }
}
