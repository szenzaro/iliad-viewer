import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Map } from '../utils/index';
import { Word } from '../utils/models';
import { TextService } from './text.service';

export type Index = Map<number[]>;

export interface SearchQuery {
  text: string;
  index: 'text' | 'lemma';
  mode: 'words' | 'alignment';
  caseSensitive: boolean;
  diacriticSensitive: boolean;
  exactMatch: boolean;
  alignment: boolean;
  pos: boolean;
  texts: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  cache: Map<any> = {};
  queryString = new Subject<SearchQuery>();

  private words = this.textService.getTextsList().pipe(
    map((manifest) => manifest.textsList.map((x) => x.id)),
    switchMap((txts) => forkJoin(txts.map((t) => this.textService.getWords(t))).pipe(
      map((x) => txts.map((text, i) => ({ text, words: x[i] }))),
      map((x) => {
        const ws: Map<Map<Word>> = {};
        x.forEach((k) => ws[k.text] = k.words);
        return ws;
      })
    )),
  );

  private resultArrays = this.queryString.pipe(
    filter((x) => !!x),
    switchMap((query) => forkJoin(query.texts
      .map((txt) => `./assets/data/texts/${txt}/index/${query.index}.json`)
      .map((url) => this.cachedGet<Index>(url))
    ).pipe(
      map((indexes) => indexes.map((x) => {
        const keys = Object.keys(x);
        const re = new RegExp(`.*${query.text}.*`, 'g');
        return keys.filter((r) => re.test(r)).map((k) => x[k]).reduce((r, v) => r.concat(v), []) as number[];
      })),
      map((x) => x.map(((ids, i) => ({ text: query.texts[i], ids })))),
    )
    ),
  );

  results = combineLatest([
    this.words,
    this.resultArrays,
    this.queryString.pipe(map(({ texts }) => texts))
  ]).pipe(
    map(([words, nestedIds, qs]) => nestedIds.map((ni, i) => ni.ids.map((id) => words[qs[i]][id]))),
    map((x) => [].concat(...x)),
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
