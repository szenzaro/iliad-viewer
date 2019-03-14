import { Component, Output } from '@angular/core';

import { POS } from 'src/app/utils';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-word-filters',
  templateUrl: './word-filters.component.html',
  styleUrls: ['./word-filters.component.scss'],
})
export class WordFiltersComponent {

  adjectiveFilter = new BehaviorSubject<boolean>(false);
  articleFilter = new BehaviorSubject<boolean>(false);
  adverbFilter = new BehaviorSubject<boolean>(false);
  nameFilter = new BehaviorSubject<boolean>(false);
  verbFilter = new BehaviorSubject<boolean>(false);
  pronounFilter = new BehaviorSubject<boolean>(false);
  numFilter = new BehaviorSubject<boolean>(false);
  masculineFilter = new BehaviorSubject<boolean>(false);
  feminineFilter = new BehaviorSubject<boolean>(false);
  neutralFilter = new BehaviorSubject<boolean>(false);
  singularFilter = new BehaviorSubject<boolean>(false);
  pluralFilter = new BehaviorSubject<boolean>(false);
  dualFilter = new BehaviorSubject<boolean>(false);
  nominativeFilter = new BehaviorSubject<boolean>(false);
  vocativeFilter = new BehaviorSubject<boolean>(false);
  accusativeFilter = new BehaviorSubject<boolean>(false);
  genitiveFilter = new BehaviorSubject<boolean>(false);
  dativeFilter = new BehaviorSubject<boolean>(false);

  @Output() filterChange = combineLatest(
    this.adjectiveFilter,
    this.articleFilter,
    this.adverbFilter,
    this.nameFilter,
    this.verbFilter,
    this.pronounFilter,
    this.numFilter,
    this.masculineFilter,
    this.feminineFilter,
    this.neutralFilter,
    this.singularFilter,
    this.pluralFilter,
    this.dualFilter,
    this.nominativeFilter,
    this.vocativeFilter,
    this.accusativeFilter,
    this.genitiveFilter,
    this.dativeFilter,
  ).pipe(
    debounceTime(100),
    map(([
      adjectiveFilter, articleFilter, adverbFilter, nameFilter, verbFilter, pronounFilter, numFilter,
      masculineFilter, feminineFilter, neutralFilter,
      singularFilter, pluralFilter, dualFilter,
      nominativeFilter, vocativeFilter, accusativeFilter, genitiveFilter, dativeFilter,
    ]) => {
      const posMap = {
        'Adjective': adjectiveFilter,
        'Article': articleFilter,
        'Adverb': adverbFilter,
        'Name': nameFilter,
        'Verb': verbFilter,
        'Pronoun': pronounFilter,
        'Num': numFilter,
        'Masculine': masculineFilter,
        'Feminine': feminineFilter,
        'Neutral': neutralFilter,
        'Singular': singularFilter,
        'Plural': pluralFilter,
        'Dual': dualFilter,
        'Nominative': nominativeFilter,
        'Vocative': vocativeFilter,
        'Accusative': accusativeFilter,
        'Genitive': genitiveFilter,
        'Dative': dativeFilter,
      };

      return Object.keys(posMap).filter((k) => posMap[k]) as POS[];
    }),
    tap(console.log),
  );

  constructor() {
    this.masculineFilter.subscribe((x) => console.log('masculine:', x));
  }
}
