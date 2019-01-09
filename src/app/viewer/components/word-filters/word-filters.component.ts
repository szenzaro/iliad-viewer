import { Component, Output } from '@angular/core';

import { POS } from 'src/app/utils';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

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

  @Output() filterChange = combineLatest(
    this.adjectiveFilter,
    this.articleFilter,
    this.adverbFilter,
    this.nameFilter,
    this.verbFilter,
    this.pronounFilter,
    this.numFilter,
  ).pipe(
    debounceTime(100),
    map(([adjectiveFilter, articleFilter, adverbFilter, nameFilter, verbFilter, pronounFilter, numFilter]) => {
      const posMap = {
        'Adjective': adjectiveFilter,
        'Article': articleFilter,
        'Adverb': adverbFilter,
        'Name': nameFilter,
        'Verb': verbFilter,
        'Pronoun': pronounFilter,
        'Num': numFilter,
      };

      return Object.keys(posMap).filter((k) => posMap[k]) as POS[];
    })
  );


}
