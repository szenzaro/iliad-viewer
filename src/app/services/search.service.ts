import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, of, Subject } from 'rxjs';
import { debounceTime, filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { containsPOStoHighlight, Map, PosFilter, removeAccents } from '../utils/index';
import { Word } from '../utils/models';
import { CacheService } from './cache.service';
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
  return new RegExp(txt, `${q.caseSensitive ? '' : 'i'}`);
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
    shareReplay(1),
  );

  results = combineLatest([
    this.queryString,
    this.words,
  ]).pipe(
    debounceTime(150),
    filter(([q, ws]) => !!q && !!ws && (q.text !== '' || q.pos)),
    map(([q, ws]) => {
      const sourceText = q.texts[0];
      const targetText = q.texts[1];
      if (q.pos) {
        const words: Word[] = [];
        if (!q.alignment) {
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

        Object.keys(ws[sourceText]).forEach((wID) => {
          const w = ws[sourceText][wID];
          if (containsPOStoHighlight(w.data && w.data.tag, q.posFilter)) {
            words.push(w);
          }
        });


        return forkJoin(words.map((w) => this.textService.getAlignment(sourceText, targetText, w.id))).pipe(
          map((entries) => entries
            .filter((e) => !!e && e.type !== 'del' && e.type !== 'ins')
            .map((e) => e.target)
            .reduce((x, y) => x.concat(y), [])
          ),
          map((targetIds) => targetIds.map((id) => ws[targetText][id])),
          map((targetWords) => words.concat(targetWords)),
        );
      }

      if (!q.alignment) {
        return forkJoin(q.texts
          .map((txt) => `./assets/data/texts/${txt}/index/${q.index}.json`)
          .map((url) => this.cacheService.cachedGet<Index>(url))
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
      }

      return this.cacheService.cachedGet<Index>(`./assets/data/texts/${sourceText}/index/${q.index}.json`).pipe(
        map((x) => {
          const keys = Object.keys(x);
          const re = getRegexp(q);
          return keys.filter((r) => re.test(q.diacriticSensitive ? r : removeAccents(r)))
            .map((k) => x[k]).reduce((r, v) => r.concat(v), []) as number[];
        }),
        map((ids) => ids.map((id) => ws[sourceText][id])),
        map((words) => words.length <= 0
          ? of([] as Word[])
          : forkJoin(words.map((w) => this.textService.getAlignment(sourceText, targetText, w.id))).pipe(
            map((entries) => entries
              .filter((e) => !!e && e.type !== 'del' && e.type !== 'ins')
              .map((e) => e.target)
              .reduce((x, y) => x.concat(y), [])
            ),
            map((targetIds) => targetIds.map((id) => ws[targetText][id])),
            map((targetWords) => words.concat(targetWords)),
          )),
        switchMap((x) => x),
      );
    }),
    switchMap((x) => x),
    shareReplay(1),
  );

  alignmentResult = combineLatest([
    this.queryString,
    this.words
  ]).pipe(
    debounceTime(150),
    filter(([q, ws]) => !!q && !!ws && (q.text !== '' || q.pos) && q.alignment),
    map(([, ws]) => ws),
  );

  constructor(
    private textService: TextService,
    private cacheService: CacheService,
  ) {
  }
}
