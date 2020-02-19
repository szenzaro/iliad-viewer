import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Map, POS, PosFilter, POS_OP } from 'src/app/utils';

import { debounceTime, distinctUntilChanged, filter, map, scan, shareReplay, startWith } from 'rxjs/operators';

import { KeyValue } from '@angular/common';
import { faBroom, faSearch } from '@fortawesome/free-solid-svg-icons';
import { combineLatest, merge, Subject } from 'rxjs';

import { marker as _T} from '@biesbjerg/ngx-translate-extract-marker';

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

  // TODO: translate pillsData keys
  pillsData = {
    Category: [
      {
        kind: 'adjective',
        label: _T('Adjective'),
        selected: () => this.filterSelected('Adjective'),
        selectedChange: (event: boolean) => this.filterItem.next({ Adjective: event }),
      },
      {
        kind: 'article',
        label: _T('Article'),
        selected: () => this.filterSelected('Article'),
        selectedChange: (event: boolean) => this.filterItem.next({ Article: event }),
      },
      {
        kind: 'particle',
        label: _T('Particle'),
        selected: () => this.filterSelected('Particle'),
        selectedChange: (event: boolean) => this.filterItem.next({ Particle: event }),
      },
      {
        kind: 'preposition',
        label: _T('Preposition'),
        selected: () => this.filterSelected('Preposition'),
        selectedChange: (event: boolean) => this.filterItem.next({ Preposition: event }),
      },
      {
        kind: 'adverb',
        label: _T('Adverb'),
        selected: () => this.filterSelected('Adverb'),
        selectedChange: (event: boolean) => this.filterItem.next({ Adverb: event }),
      },
      {
        kind: 'name',
        label: _T('Name'),
        selected: () => this.filterSelected('Name'),
        selectedChange: (event: boolean) => this.filterItem.next({ Name: event }),
      },
      {
        kind: 'anthroponymic',
        label: _T('Anthroponymic'),
        selected: () => this.filterSelected('Anthroponymic'),
        selectedChange: (event: boolean) => this.filterItem.next({ Anthroponymic: event }),
      },
      {
        kind: 'toponym',
        label: _T('Toponym'),
        selected: () => this.filterSelected('Toponym'),
        selectedChange: (event: boolean) => this.filterItem.next({ Toponym: event }),
      },
      {
        kind: 'patronymic',
        label: _T('Patronymic'),
        selected: () => this.filterSelected('Patronymic'),
        selectedChange: (event: boolean) => this.filterItem.next({ Patronymic: event }),
      },
      {
        kind: 'pronoun',
        label: _T('Pronoun'),
        selected: () => this.filterSelected('Pronoun'),
        selectedChange: (event: boolean) => this.filterItem.next({ Pronoun: event }),
      },
      {
        kind: 'verb',
        label: _T('Verb'),
        selected: () => this.filterSelected('Verb'),
        selectedChange: (event: boolean) => this.filterItem.next({ Verb: event }),
      },
      {
        kind: 'num',
        label: _T('Num'),
        selected: () => this.filterSelected('Num'),
        selectedChange: (event: boolean) => this.filterItem.next({ Num: event }),
      },
      {
        kind: 'neg',
        label: _T('Negation'),
        selected: () => this.filterSelected('Neg'),
        selectedChange: (event: boolean) => this.filterItem.next({ Neg: event }),
      },
      {
        kind: 'conj',
        label: _T('Conjunction'),
        selected: () => this.filterSelected('Conj'),
        selectedChange: (event: boolean) => this.filterItem.next({ Conj: event }),
      },
      {
        kind: 'intj',
        label: _T('Interjection'),
        selected: () => this.filterSelected('Intj'),
        selectedChange: (event: boolean) => this.filterItem.next({ Intj: event }),
      },
    ],
    Gender: [
      {
        kind: 'masculine',
        label: _T('Masculine'),
        gender: 'M',
        selected: () => this.filterSelected('Masculine'),
        selectedChange: (event: boolean) => this.filterItem.next({ Masculine: event }),
      },
      {
        kind: 'feminine',
        label: _T('Feminine'),
        gender: 'F',
        selected: () => this.filterSelected('Feminine'),
        selectedChange: (event: boolean) => this.filterItem.next({ Feminine: event }),
      },
      {
        kind: 'neutral',
        label: _T('Neutral'),
        gender: 'N',
        selected: () => this.filterSelected('Neutral'),
        selectedChange: (event: boolean) => this.filterItem.next({ Neutral: event }),
      },
    ],
    Cardinality: [
      {
        kind: 'singular',
        label: _T('Singular'),
        selected: () => this.filterSelected('Singular'),
        selectedChange: (event: boolean) => this.filterItem.next({ Singular: event }),
      },
      {
        kind: 'plural',
        label: _T('Plural'),
        selected: () => this.filterSelected('Plural'),
        selectedChange: (event: boolean) => this.filterItem.next({ Plural: event }),
      },
      {
        kind: 'dual',
        label: _T('Dual'),
        selected: () => this.filterSelected('Dual'),
        selectedChange: (event: boolean) => this.filterItem.next({ Dual: event }),
      },
    ],
    Cases: [
      {
        kind: 'nominative',
        label: _T('Nominative'),
        selected: () => this.filterSelected('Nominative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Nominative: event }),
      },
      {
        kind: 'vocative',
        label: _T('Vocative'),
        selected: () => this.filterSelected('Vocative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Vocative: event }),
      },
      {
        kind: 'accusative',
        label: _T('Accusative'),
        selected: () => this.filterSelected('Accusative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Accusative: event }),
      },
      {
        kind: 'genitive',
        label: _T('Genitive'),
        selected: () => this.filterSelected('Genitive'),
        selectedChange: (event: boolean) => this.filterItem.next({ Genitive: event }),
      },
      {
        kind: 'dative',
        label: _T('Dative'),
        selected: () => this.filterSelected('Dative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Dative: event }),
      },
    ],
    Tense: [
      {
        kind: 'present',
        label: _T('Present'),
        selected: () => this.filterSelected('Present'),
        selectedChange: (event: boolean) => this.filterItem.next({ Present: event }),
      },
      {
        kind: 'imperfect',
        label: _T('Imperfect'),
        selected: () => this.filterSelected('Imperfect'),
        selectedChange: (event: boolean) => this.filterItem.next({ Imperfect: event }),
      },
      {
        kind: 'future',
        label: _T('Future'),
        selected: () => this.filterSelected('Future'),
        selectedChange: (event: boolean) => this.filterItem.next({ Future: event }),
      },
      {
        kind: 'aorist',
        label: _T('Aorist'),
        selected: () => this.filterSelected('Aorist'),
        selectedChange: (event: boolean) => this.filterItem.next({ Aorist: event }),
      },
      {
        kind: 'perfect',
        label: _T('Perfect'),
        selected: () => this.filterSelected('Perfect'),
        selectedChange: (event: boolean) => this.filterItem.next({ Perfect: event }),
      },
      {
        kind: 'pluperfect',
        label: _T('Pluperfect'),
        selected: () => this.filterSelected('Pluperfect'),
        selectedChange: (event: boolean) => this.filterItem.next({ Pluperfect: event }),
      },
      {
        kind: 'future-perfect',
        label: _T('Future perfect'),
        selected: () => this.filterSelected('FuturePerfect'),
        selectedChange: (event: boolean) => this.filterItem.next({ FuturePerfect: event }),
      },
    ],
    Mood: [
      {
        kind: 'indicative',
        label: _T('Indicative'),
        selected: () => this.filterSelected('Indicative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Indicative: event }),
      },
      {
        kind: 'subjunctive',
        label: _T('Subjunctive'),
        selected: () => this.filterSelected('Subjunctive'),
        selectedChange: (event: boolean) => this.filterItem.next({ Subjunctive: event }),
      },
      {
        kind: 'imperative',
        label: _T('Imperative'),
        selected: () => this.filterSelected('Imperative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Imperative: event }),
      },
      {
        kind: 'optative',
        label: _T('Optative'),
        selected: () => this.filterSelected('Optative'),
        selectedChange: (event: boolean) => this.filterItem.next({ Optative: event }),
      },
      {
        kind: 'infinitive',
        label: _T('Infinitive'),
        selected: () => this.filterSelected('Infinitive'),
        selectedChange: (event: boolean) => this.filterItem.next({ Infinitive: event }),
      },
      {
        kind: 'participle',
        label: _T('Participle'),
        selected: () => this.filterSelected('Participle'),
        selectedChange: (event: boolean) => this.filterItem.next({ Participle: event }),
      },
    ],
    Voice: [
      {
        kind: 'active',
        label: _T('Active'),
        selected: () => this.filterSelected('Active'),
        selectedChange: (event: boolean) => this.filterItem.next({ Active: event }),
      },
      {
        kind: 'middle',
        label: _T('Middle'),
        selected: () => this.filterSelected('Middle'),
        selectedChange: (event: boolean) => this.filterItem.next({ Middle: event }),
      },
      {
        kind: 'passive',
        label: _T('Passive'),
        selected: () => this.filterSelected('Passive'),
        selectedChange: (event: boolean) => this.filterItem.next({ Passive: event }),
      },
    ],
    Person: [
      {
        kind: 'first-person',
        label: _T('1st'),
        selected: () => this.filterSelected('1st'),
        selectedChange: (event: boolean) => this.filterItem.next({ '1st': event }),
      },
      {
        kind: 'second-person',
        label: _T('2nd'),
        selected: () => this.filterSelected('2nd'),
        selectedChange: (event: boolean) => this.filterItem.next({ '2nd': event }),
      },
      {
        kind: 'third-person',
        label: _T('3rd'),
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
