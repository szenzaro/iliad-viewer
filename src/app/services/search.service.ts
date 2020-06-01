import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, of, Subject } from 'rxjs';
import { debounceTime, filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { containsPOStoHighlight, Map, removeAccents, WordsFilter } from '../utils/index';
import { Word } from '../utils/models';
import { AlignmentService, AlignmentType } from './alignment.service';
import { CacheService } from './cache.service';
import { TextService } from './text.service';

export type Index = Map<number[]>;

export interface SearchQuery {
  text: string;
  index: 'text' | 'lemma';
  alignmentType: 'auto' | 'manual';
  caseSensitive: boolean;
  diacriticSensitive: boolean;
  exactMatch: boolean;
  alignment: boolean;
  pos: boolean;
  texts: string[];
  wFilter: WordsFilter;
}

function getRegexp(q: SearchQuery): RegExp {
  const txt = `${q.exactMatch ? '^' : '.*'}${q.diacriticSensitive ? q.text : removeAccents(q.text)}${q.exactMatch ? '$' : '.*'}`;
  return new RegExp(txt, `${q.caseSensitive ? '' : 'i'}`);
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private _defaultQuery: SearchQuery = {
    text: '',
    diacriticSensitive: false,
    caseSensitive: false,
    exactMatch: false,
    alignment: true,
    pos: false,
    index: 'text',
    texts: ['homeric', 'paraphrase'],
    wFilter: undefined,
    alignmentType: 'manual',
  };

  queryString = new Subject<SearchQuery>();
  loading = new BehaviorSubject<boolean>(false);

  private words = this.textService.textList.pipe(
    map((textsList) => textsList.map((x) => x.id)),
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

  alignmentChants = this.queryString.pipe(
    switchMap((qs) => this.alignmentService.getAlignmentChants(qs.texts[0], qs.texts[1], qs.alignmentType)),
  );

  results = combineLatest([
    this.queryString,
    this.words,
    this.alignmentChants,
  ]).pipe(
    debounceTime(150),
    filter(([q, ws]) => !!q && !!ws && (q.text !== '' || q.pos)),
    map(([q, ws, als]) => {
      if (q.pos) {
        if (!q.alignment) {
          return of(this.queryPosText(ws, q));
        }
        return this.queryPosAlignment(ws, q, als);
      }

      if (!q.alignment) {
        return this.queryTex(ws, q);
      }
      return this.queryTextAlignment(ws, q, als);
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

  get defaultQuery(): SearchQuery {
    return { ...this._defaultQuery };
  }

  queryPosText = (ws: Map<Map<Word>>, q: SearchQuery) => {
    return Object.keys(ws)
      .filter((t) => q.texts.includes(t))
      .map((textID) => Object.values(ws[textID]))
      .reduce((x, y) => x.concat(Object.values(y).filter((w) => containsPOStoHighlight(w.data && w.data.tag, q.wFilter))), [])
      ;
  }

  queryPosAlignment = (ws: Map<Map<Word>>, q: SearchQuery, als: number[]) => {
    const [sourceText, targetText] = q.texts;
    const words = Object.keys(ws[sourceText])
      .map((wID) => ws[sourceText][wID])
      .filter((w) => containsPOStoHighlight(w.data && w.data.tag, q.wFilter))
      .filter((w) => als.includes(w.chant))
      ;

    return this.alignmentTargetWords(words, sourceText, targetText, q.alignmentType, ws).pipe(
      map((targetWords) => words.concat(targetWords))
    );
  }

  queryTex = (ws: Map<Map<Word>>, q: SearchQuery) => {
    return forkJoin(q.texts
      .map((txt) => `./assets/data/texts/${txt}/index/${q.index}.json`)
      .map((url) => this.cacheService.cachedGet<Index>(url))
    ).pipe(
      map((indexes) => indexes.map((x) => {
        const keys = Object.keys(x);
        const re = getRegexp(q);
        return keys
          .filter((r) => re.test(q.diacriticSensitive ? r : removeAccents(r)))
          .map((k) => x[k])
          .reduce((r, v) => r.concat(v), []);
      })),
      map((x) => x.map(((ids, i) => ({ text: q.texts[i], ids })))),
      map((nestedIds) => q.texts.length > 0 ? nestedIds.map((ni, i) => ni.ids.map((id) => ws[q.texts[i]][id])) : []),
      map((x) => [].concat(...x) as Word[]),
    );
  }

  queryTextAlignment = (ws: Map<Map<Word>>, q: SearchQuery, als: number[]) => {
    const [sourceText, targetText] = q.texts;
    return this.cacheService.cachedGet<Index>(`./assets/data/texts/${sourceText}/index/${q.index}.json`).pipe(
      map((x) => {
        const keys = Object.keys(x);
        const re = getRegexp(q);
        return keys.filter((r) => re.test(q.diacriticSensitive ? r : removeAccents(r)))
          .map((k) => x[k]).reduce((r, v) => r.concat(v), []) as number[];
      }),
      map((ids) => ids.map((id) => ws[sourceText][id])),
      map((wordsData) => wordsData.filter((w) => als.includes(w.chant))),
      map((wordsData) => wordsData.length <= 0
        ? of([] as Word[])
        : this.alignmentTargetWords(wordsData, sourceText, targetText, q.alignmentType, ws).pipe(
          map((targetWords) => wordsData.concat(targetWords)),
        )),
      switchMap((x) => x),
    );
  }

  alignmentTargetWords = (wordsData: Word[], sourceText: string, targetText: string, alignmentType: AlignmentType, ws: Map<Map<Word>>) => {
    return forkJoin(wordsData.map((w) => this.alignmentService.getAlignment(sourceText, targetText, w.id, alignmentType))).pipe(
      map((entries) => entries
        .filter((e) => !!e && e.type !== 'del' && e.type !== 'ins')
        .map((e) => e.target)
        .reduce((x, y) => x.concat(y), [])
      ),
      map((targetIds) => targetIds.map((id) => ws[targetText][id]))
    );
  }

  constructor(
    private textService: TextService,
    private cacheService: CacheService,
    private alignmentService: AlignmentService,
  ) {
  }
}
