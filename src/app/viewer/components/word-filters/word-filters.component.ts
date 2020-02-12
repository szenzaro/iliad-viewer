import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Map, POS, PosFilter, POS_OP } from 'src/app/utils';

import { debounceTime, distinctUntilChanged, filter, map, scan, shareReplay, startWith } from 'rxjs/operators';

import { KeyValue } from '@angular/common';
import { faBroom, faSearch } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, merge, Subject } from 'rxjs';

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
    map<boolean, POS_OP>((v) => (v ? 'and' : 'or')),
    startWith<POS_OP>('or')
  );

  private _pos: PosFilter;
  @Input() set pos(data: PosFilter) {
    this._pos = data;
    this.posChange.next(data);
  }
  get pos() { return this._pos; }
  posChange = new Subject<PosFilter>();

  @Input() disabled = false;
  @Output() filterChange = merge(
    this.posChange,
    combineLatest([
      this.currentFilter.pipe(
        map((currentFilter) => Object.keys(currentFilter).filter((k) => currentFilter[k]) as POS[]),
      ),
      this.opChange,
    ]).pipe(
      debounceTime(100),
      map(([pos, op]) => ({ op, pos } as PosFilter)),
    ),
  ).pipe(
    shareReplay(1),
  );

  @Input() submitBtn = false;
  @Output() submitFilter = new EventEmitter();

  pillsData = {
    Category: [
      {
        kind: 'adjective',
        label: 'Adjective',
        selected: () => this.filterSelected('Adjective'),
        selectedChange: (event: boolean) => this.filterItem.next({ Adjective: event }),
      },
      {
        kind: 'article',
        label: 'Article',
        selected: () => this.filterSelected('Article'),
        selectedChange: (event: boolean) => this.filterItem.next({ Article: event }),
      },
      {
        kind: 'particle',
        label: 'Particle',
        selected: () => this.filterSelected('Particle'),
        selectedChange: (event: boolean) => this.filterItem.next({ Particle: event }),
      },
      {
        kind: 'preposition',
        label: 'Preposition',
        selected: () => this.filterSelected('Preposition'),
        selectedChange: (event: boolean) => this.filterItem.next({ Preposition: event }),
      },
      {
        kind: 'adverb',
        label: 'Adverb',
        selected: () => this.filterSelected('Adverb'),
        selectedChange: (event: boolean) => this.filterItem.next({ Adverb: event }),
      },
      {
        kind: 'name',
        label: 'Name',
        selected: () => this.filterSelected('Name'),
        selectedChange: (event: boolean) => this.filterItem.next({ Name: event }),
      },
      {
        kind: 'anthroponymic',
        label: 'Anthroponymic',
        selected: () => this.filterSelected('Anthroponymic'),
        selectedChange: (event: boolean) => this.filterItem.next({ Anthroponymic: event }),
      },
      {
        kind: 'toponym',
        label: 'Toponym',
        selected: () => this.filterSelected('Toponym'),
        selectedChange: (event: boolean) => this.filterItem.next({ Toponym: event }),
      },
      {
        kind: 'patronymic',
        label: 'Patronymic',
        selected: () => this.filterSelected('Patronymic'),
        selectedChange: (event: boolean) => this.filterItem.next({ Patronymic: event }),
      },
      {
        kind: 'pronoun',
        label: 'Pronoun',
        selected: () => this.filterSelected('Pronoun'),
        selectedChange: (event: boolean) => this.filterItem.next({ Pronoun: event }),
      },
      {
        kind: 'verb',
        label: 'Verb',
        selected: () => this.filterSelected('Verb'),
        selectedChange: (event: boolean) => this.filterItem.next({ Verb: event }),
      },
      {
        kind: 'num',
        label: 'Num',
        selected: () => this.filterSelected('Num'),
        selectedChange: (event: boolean) => this.filterItem.next({ Num: event }),
      },
      {
        kind: 'neg',
        label: 'Negation',
        selected: () => this.filterSelected('Neg'),
        selectedChange: (event: boolean) => this.filterItem.next({ Neg: event }),
      },
      {
        kind: 'conj',
        label: 'Conjunction',
        selected: () => this.filterSelected('Conj'),
        selectedChange: (event: boolean) => this.filterItem.next({ Conj: event }),
      },
      {
        kind: 'intj',
        label: 'Interjection',
        selected: () => this.filterSelected('Intj'),
        selectedChange: (event: boolean) => this.filterItem.next({ Intj: event }),
      },
    ],
    Gender: [
      {
        kind: 'masculine',
        label: 'Masculine',
        gender: 'M',
        selected: () => this.filterSelected('Masculine'),
        selectedChange: (event: boolean) => this.filterItem.next({ Masculine: event }),
      },
      {
        kind: 'feminine',
        label: 'Feminine',
        gender: 'F',
        selected: () => this.filterSelected('Feminine'),
        selectedChange: (event: boolean) => this.filterItem.next({ Feminine: event }),
      },
      {
        kind: 'neutral',
        label: 'Neutral',
        gender: 'N',
        selected: () => this.filterSelected('Neutral'),
        selectedChange: (event: boolean) => this.filterItem.next({ Neutral: event }),
      },
    ],
    Cardinality: [
      {
        kind: 'singular',
        label: 'Singular',
        selected: () => this.filterSelected('Singular'),
        selectedChange: (event: boolean) => this.filterItem.next({ Singular: event }),
      },
      {
        kind: 'plural',
        label: 'Plural',
        selected: () => this.filterSelected('Plural'),
        selectedChange: (event: boolean) => this.filterItem.next({ Plural: event }),
      },
      {
        kind: 'dual',
        label: 'Dual',
        selected: () => this.filterSelected('Dual'),
        selectedChange: (event: boolean) => this.filterItem.next({ Dual: event }),
      },
    ],
    Cases: [
      {
        kind: 'nominative',
        label: 'Nominative',
        selected: () => this.filterSelected('Nominative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Nominative: event }),
      },
      {
        kind: 'vocative',
        label: 'Vocative',
        selected: () => this.filterSelected('Vocative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Vocative: event }),
      },
      {
        kind: 'accusative',
        label: 'Accusative',
        selected: () => this.filterSelected('Accusative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Accusative: event }),
      },
      {
        kind: 'genitive',
        label: 'Genitive',
        selected: () => this.filterSelected('Genitive'),
        selectedChange: (event: boolean) => this.filterItem.next({ Genitive: event }),
      },
      {
        kind: 'dative',
        label: 'Dative',
        selected: () => this.filterSelected('Dative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Dative: event }),
      },
    ],
    Tense: [
      {
        kind: 'present',
        label: 'Present',
        selected: () => this.filterSelected('Present'),
        selectedChange: (event: boolean) => this.filterItem.next({ Present: event }),
      },
      {
        kind: 'imperfect',
        label: 'Imperfect',
        selected: () => this.filterSelected('Imperfect'),
        selectedChange: (event: boolean) => this.filterItem.next({ Imperfect: event }),
      },
      {
        kind: 'future',
        label: 'Future',
        selected: () => this.filterSelected('Future'),
        selectedChange: (event: boolean) => this.filterItem.next({ Future: event }),
      },
      {
        kind: 'aorist',
        label: 'Aorist',
        selected: () => this.filterSelected('Aorist'),
        selectedChange: (event: boolean) => this.filterItem.next({ Aorist: event }),
      },
      {
        kind: 'perfect',
        label: 'Perfect',
        selected: () => this.filterSelected('Perfect'),
        selectedChange: (event: boolean) => this.filterItem.next({ Perfect: event }),
      },
      {
        kind: 'pluperfect',
        label: 'Pluperfect',
        selected: () => this.filterSelected('Pluperfect'),
        selectedChange: (event: boolean) => this.filterItem.next({ Pluperfect: event }),
      },
      {
        kind: 'future-perfect',
        label: 'Future perfect',
        selected: () => this.filterSelected('FuturePerfect'),
        selectedChange: (event: boolean) => this.filterItem.next({ FuturePerfect: event }),
      },
    ],
    Mood: [
      {
        kind: 'indicative',
        label: 'Indicative',
        selected: () => this.filterSelected('Indicative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Indicative: event }),
      },
      {
        kind: 'subjunctive',
        label: 'Subjunctive',
        selected: () => this.filterSelected('Subjunctive'),
        selectedChange: (event: boolean) => this.filterItem.next({ Subjunctive: event }),
      },
      {
        kind: 'imperative',
        label: 'Imperative',
        selected: () => this.filterSelected('Imperative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Imperative: event }),
      },
      {
        kind: 'optative',
        label: 'Optative',
        selected: () => this.filterSelected('Optative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Optative: event }),
      },
      {
        kind: 'infinitive',
        label: 'Infinitive',
        selected: () => this.filterSelected('Infinitive'),
        selectedChange: (event: boolean) => this.filterItem.next({ Infinitive: event }),
      },
      {
        kind: 'participle',
        label: 'Participle',
        selected: () => this.filterSelected('Participle'),
        selectedChange: (event: boolean) => this.filterItem.next({ Participle: event }),
      },
    ],
    Voice: [
      {
        kind: 'active',
        label: 'Active',
        selected: () => this.filterSelected('Active'),
        selectedChange: (event: boolean) => this.filterItem.next({ Active: event }),
      },
      {
        kind: 'middle',
        label: 'Middle',
        selected: () => this.filterSelected('Middle'),
        selectedChange: (event: boolean) => this.filterItem.next({ Middle: event }),
      },
      {
        kind: 'passive',
        label: 'Passive',
        selected: () => this.filterSelected('Passive'),
        selectedChange: (event: boolean) => this.filterItem.next({ Passive: event }),
      },
    ],
    Person: [
      {
        kind: 'first-person',
        label: '1st',
        selected: () => this.filterSelected('1st'),
        selectedChange: (event: boolean) => this.filterItem.next({ '1st': event }),
      },
      {
        kind: 'second-person',
        label: '2nd',
        selected: () => this.filterSelected('2nd'),
        selectedChange: (event: boolean) => this.filterItem.next({ '2nd': event }),
      },
      {
        kind: 'third-person',
        label: '3rd',
        selected: () => this.filterSelected('3rd'),
        selectedChange: (event: boolean) => this.filterItem.next({ '3rd': event }),
      },
    ],
  };

  originalOrder = (_a: KeyValue<number, string>, _b: KeyValue<number, string>): number => {
    return 0;
  }

  filterSelected = (label: POS) => {
    return this.filterChange.pipe(
      filter((x) => !!x),
      distinctUntilChanged(),
      map((x) => x.pos.includes(label)),
      startWith(false),
    );
  }

  filterFromLabel(label: string, value: boolean): Map<boolean> {
    const obj = {};
    obj[label] = value;
    return obj;
  }

  genderFromLabel(label: string) {
    switch (label) {
      case 'Masculine':
        return 'M';
      case 'Feminine':
        return 'F';
      case 'Neutral':
        return 'N';
      default:
        return undefined;
    }
  }
}
