import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap, debounceTime } from 'rxjs/operators';
import { containsPOStoHighlight, Map, PosFilter, removeAccents } from '../utils/index';
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
  posFilter: PosFilter;
}

function getRegexp(q: SearchQuery): RegExp {
  const txt = `${q.exactMatch ? '^' : '.*'}${q.diacriticSensitive ? q.text : removeAccents(q.text)}${q.exactMatch ? '$' : '.*'}`;
  return new RegExp(txt, `g${q.caseSensitive ? '' : 'i'}`);
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  cache: Map<any> = {};
  queryString = new Subject<SearchQuery>();
  loading = new BehaviorSubject<boolean>(false);

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

  results = combineLatest([
    this.queryString,
    this.words,
  ]).pipe(
    debounceTime(150),
    filter(([q, ws]) => !!q && !!ws && (q.text !== '' || q.pos)),
    map(([q, ws]) => {
      if (q.pos) {
        const words: Word[] = [];
        Object.keys(ws)
          .filter((t) => q.texts.includes(t))
          .forEach((text) => {
            Object.keys(ws[text]).forEach((wID) => {
              const w = ws[text][wID];
              if (containsPOStoHighlight(w.data && w.data.tag, q.posFilter)) {
                words.push(w);
              }
            });
          });
        return of(words);
      }

      return forkJoin(q.texts
        .map((txt) => `./assets/data/texts/${txt}/index/${q.index}.json`)
        .map((url) => this.cachedGet<Index>(url))
      ).pipe(
        map((indexes) => indexes.map((x) => {
          const keys = Object.keys(x);
          const re = getRegexp(q);
          return keys.filter((r) => re.test(q.diacriticSensitive ? r : removeAccents(r)))
            .map((k) => x[k]).reduce((r, v) => r.concat(v), []) as number[];
        })),
        map((x) => x.map(((ids, i) => ({ text: q.texts[i], ids })))),
        map((nestedIds) => q.texts.length > 0 ? nestedIds.map((ni, i) => ni.ids.map((id) => ws[q.texts[i]][id])) : []),
        map((x) => [].concat(...x) as Word[]),
      );
    }),
    switchMap((x) => x),
    shareReplay(1),
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
