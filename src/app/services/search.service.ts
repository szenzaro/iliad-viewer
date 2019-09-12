import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Map, removeAccents } from '../utils/index';
import { TextService } from './text.service';

export type Index = Map<number[]>;

export interface SearchQuery {
  text: string;
  index: 'text' | 'lemma';
  mode: 'words' | 'alignment';
  ignoreCase: boolean;
  ignoreAccents: boolean;
  texts: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  cache: Map<any> = {};
  queryString = new Subject<SearchQuery>();

  private words = this.textService.getWords('homeric');

  resultArray = this.queryString.pipe(
    filter((x) => !!x),
    switchMap((query) => this.cachedGet<Observable<Index>>('./assets/data/texts/homeric/index.json')
      .pipe(
        map((x) => {
          const keys = Object.keys(x);
          const re = new RegExp(`.*${query.text}.*`, 'g');
          return keys.filter((r) => re.test(r)).map((k) => x[k]).reduce((r, v) => r.concat(v), []) as number[];
        }),
      )
    ),
  );

  results = combineLatest([this.words, this.resultArray]).pipe(
    map(([words, ids]) => ids.map((id) => words[id])),
  );

  constructor(
    private http: HttpClient,
    private textService: TextService,
  ) {
  }

  private cachedGet<T>(path: string): Observable<T> {
    return !!this.cache[path]
      ? of<T>(this.cache[path])
      : this.http.get<T>(path).pipe(tap((x) => this.cache[path] = x));
  }
}
