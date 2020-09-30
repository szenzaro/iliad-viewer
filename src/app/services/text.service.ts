import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of } from 'rxjs';
import { map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Map, uuid } from '../utils/index';
import { Annotation, AnnotationType, Verse, VerseRowType, Word } from '../utils/models';
import { AnnotationModalComponent } from '../viewer/components/annotation-modal/annotation-modal.component';
import { OsdAnnotation } from '../viewer/components/openseadragon/openseadragon.component';
import { AlignmentType } from './alignment.service';
import { CacheService } from './cache.service';

function getVersesFromRange(verses: Verse[], range?: [number, number]) {
  let vs: Verse[] = !!range
    ? verses.filter((v) => range[0] <= v.n && v.n <= range[1])
    : verses;

  const lIndex = verses.indexOf(vs[0]);
  const rIndex = verses.indexOf(vs[vs.length - 1]);

  if (!!verses[lIndex - 1] && verses[lIndex - 1].n === 't') {
    vs = [verses[lIndex - 1]].concat(vs);
  }

  if (!!verses[rIndex + 1] && verses[rIndex + 1].n === 'f') {
    vs = vs.concat([verses[rIndex + 1]]);
  }
  return vs;
}

function getWordFromRawData(id: string, data: [string, string, string, string, number], source: string, chant: number): Word {
  const [text, normalized, lemma, tag, verse] = data;
  return { id, text, chant, source, data: { id, normalized, lemma, tag }, verse };
}

function getWordIdsFromVerse(verse: VerseRowType) {
  return verse[0] === 't' || verse[0] === 'f'
    ? verse[1]
    : verse[0] === 'v'
      ? verse[2]
      : [];
}

function getVerse(position: number, verse: VerseRowType, source: string, chant: number, words: Word[]) {
  const n = verse[0] === 't' || verse[0] === 'f' ? verse[0] : verse[1];
  const id = verse[0] === 't' ? position : position + 1;
  return { id, n, words, source, chant } as Verse;
}

export interface TextItem {
  id: string;
  label: string;
  chants: number[];
}

export interface TextManifest {
  textsList: TextItem[];
  mainText: string;
  alignments: AlignmentItem[];
  scholieAlignments: AlignmentItem[];
  manuscriptPages: number;
}

export interface AlignmentItem {
  source: string;
  target: string;
  type: AlignmentType;
  chants: number[];
}

type PageInfo = [number, [number, number], [number, number]];

@Injectable({
  providedIn: 'root'
})
export class TextService {
  private generateAnnotation: { [T in AnnotationType]: (a: Annotation) => HTMLDivElement } = {
    verse: this.verseElement,
    title: this.titleElement,
    scholie: this.scholieElement,
    ref: this.refElement,
    varia: this.variaElement,
    ornament: this.ornamentElement,
  };

  pagesToVerse = this.cacheService.cachedGet<{ [key: string]: PageInfo[] }>('./assets/manuscript/pagesToVerses.json').pipe(
    shareReplay(1),
  );

  chantsInfo = this.pagesToVerse.pipe(
    map((x) => {
      const chants: Map<Array<{ page: number, verse: number }>> = {};
      Object.keys(x).forEach((page) => {
        x[page].forEach((pi) => {
          const chant = pi[0];
          const verse = pi[1][1];
          if (!chants[chant]) { chants[chant] = []; }
          chants[chant].push({ page: +page, verse });
        });
      });
      Object.keys(chants).forEach((c) => chants[c] = chants[c].sort((a, b) => a.verse - b.verse));
      return chants;
    }),
    shareReplay(1),
  );

  booksToPages = this.chantsInfo.pipe(
    map((chants) => {
      const btp: Map<number[]> = {};
      Object.keys(chants).forEach((chant) => {
        btp[chant] = chants[chant].map(({ page }) => page);
      });
      return btp;
    }),
    shareReplay(1),
  );

  versesByChant = this.chantsInfo.pipe(
    map((chants) => {
      const vbc: Map<number> = {};
      Object.keys(chants).forEach((chant) => {
        vbc[chant] = chants[chant][chants[chant].length - 1].verse;
      });
      return vbc;
    }),
    shareReplay(1),
  );

  constructor(
    private readonly cacheService: CacheService,
    private readonly modalService: NgbModal,
  ) {
  }

  manifest = this.cacheService.cachedGet<TextManifest>('./assets/data/manifest.json').pipe(shareReplay(1));
  textList = this.manifest.pipe(map(({ textsList }) => textsList));

  getPageFromVerse(chant: number, verse: number) {
    return this.cacheService.cachedGet<{ [key: string]: PageInfo[] }>('./assets/manuscript/pagesToVerses.json')
      .pipe(
        map((pages) => +(Object.keys(pages).find((x) => {
          const entry = pages[x].filter((e) => e[0] === chant).map((v) => verse <= v[1][1] && verse >= v[1][0]);
          return entry.length > 0 && entry[0];
        }))),
      );
  }

  getChantWords(source: string, chant: number) {
    return this.cacheService.cachedGet<Map<[string, string, string, string, number]>>(`./assets/data/texts/${source}/${chant}/words.json`)
      .pipe(
        map((s) => {
          const words: Map<Word> = {};
          Object.keys(s).forEach((id) => { words[id] = getWordFromRawData(id, s[id], source, chant); });
          return words;
        }),
      );
  }

  getVerses(text: string, chant: number, range?: [number, number]) {
    if (!chant || !text) {
      return of<Verse[]>([]);
    }
    const cacheKey = `${text}-c${chant}`;
    if (!!this.cacheService.cache[cacheKey]) {
      return of<Verse[]>(getVersesFromRange(this.cacheService.cache[cacheKey])).pipe(
        map((verses) => getVersesFromRange(verses, range)),
      );
    }

    return this.getChants(text).pipe(
      switchMap((chants) => chants.includes(chant)
        ? forkJoin([
          this.cacheService.cachedGet<VerseRowType[]>(`./assets/data/texts/${text}/${chant}/verses.json`),
          this.getChantWords(text, chant),
        ]).pipe(
          map(([verses, words]) => verses.map((v, i) => getVerse(i, v, text, chant, getWordIdsFromVerse(v).map((id) => words[id])))),
          tap((verses) => this.cacheService.cache[cacheKey] = verses),
          map((verses) => getVersesFromRange(verses, range)),
        )
        : of<Verse[]>([])
      ),
    );
  }

  getAllVerses(text: string) {
    const cacheKey = `${text}-call`;
    if (!!this.cacheService.cache[cacheKey]) {
      return of<Verse[]>(this.cacheService.cache[cacheKey]);
    }

    return this.getChants(text).pipe(
      map((chants) => chants.map((chant) => ({
        verses: this.cacheService.cachedGet<VerseRowType[]>(`./assets/data/texts/${text}/${chant}/verses.json`),
        words: this.getChantWords(text, chant),
        chant,
      }))),
      map((vss) => vss.map(({ verses, words, chant }) => forkJoin([verses, words]).pipe(
        map(([vs, ws]) => vs.map((v, i) => getVerse(i, v, text, chant, getWordIdsFromVerse(v).map((id) => ws[id])))),
      ))),
      switchMap((vs) => forkJoin(vs)),
      map((vs) => vs.reduce((x, y) => x.concat(y), [])),
      tap((verses) => this.cacheService.cache[cacheKey] = verses),
    );

  }

  getVerseFromNumber(text: string, chant: number, n: number) {
    return this.getVerses(text, chant).pipe(
      map((verses) => verses.find((v) => v.n === +n)),
    );
  }

  getWords(text: string) {
    const cacheKey = `words-${text}`;
    if (!this.cacheService.cache[cacheKey]) {
      return this.getChants(text)
        .pipe(
          switchMap((chants) => forkJoin(chants.map((c) => this.getChantWords(text, c)))),
          map((chantWords) => chantWords.reduce((d, ws) => ({ ...d, ...ws }), {})),
          tap((words) => this.cacheService.cache[cacheKey] = words),
        );
    }
    return of<Map<Word>>(this.cacheService.cache[`words-${text}`] as Map<Word>);
  }

  getVersesNumberFromPage(n: number, chant?: number) {
    return this.cacheService.cachedGet<{ [key: string]: PageInfo[] }>('./assets/manuscript/pagesToVerses.json')
      .pipe(
        map((pages) => {
          const entry = chant !== undefined
            ? pages[`${n}`]?.find((x) => x[0] === chant)
            : pages[`${n}`][pages[`${n}`].length - 1];
          return (!!entry
            ? [entry[1], entry[2]]
            : [[0, 0], [0, 0]]) as [[number, number], [number, number]];
        }),
      );
  }

  getPageNumbers(chant: number) {
    return this.booksToPages
      .pipe(
        map((pages) => pages[`${chant}`] || []),
      );
  }

  getNumberOfChants(text: string) {
    return this.getChants(text)
      .pipe(
        map((chants) => chants.length),
      );
  }

  getChants(text: string) {
    return this.manifest
      .pipe(
        map((textManifest) => {
          const textInfo = textManifest.textsList.find((x) => x.id === text);
          return textInfo.chants;
        }),
      );
  }

  getChantsPages(text: string) {
    return this.getChants(text).pipe(
      mergeMap((chantsNum) => forkJoin(chantsNum
        .map((chant) => this.getPageNumbers(chant).pipe(map((pages) => ({ chant, pages })))
        ),
      ).pipe(
        map((pagesInfo) => {
          const m: Map<number[]> = {};
          pagesInfo.forEach(({ chant, pages }) => m[chant] = pages);
          return m;
        })
      ))
    );
  }

  getAnnotations() {
    return this.cacheService.cachedGet<Annotation[]>('./assets/manuscript/annotations.json')
      .pipe(
        map((arr) => {
          const annotations: Map<OsdAnnotation[]> = {};
          arr.forEach((a) => {
            annotations[a.page] = !annotations[a.page] ? [] : annotations[a.page].concat(this.newAnnotation(a));
          });
          return annotations;
        }),
      );
  }

  openAnnotation(text: string) {
    const modalRef = this.modalService.open(AnnotationModalComponent);
    (modalRef.componentInstance as AnnotationModalComponent).text = text;
  }

  private verseElement({ type, data }: Annotation) {
    const e = document.createElement('div');
    e.classList.add('annotation', type, data.type, data.shape);
    const span = document.createElement('span');
    span.classList.add('invisible');
    span.innerHTML = `${data.type === 'homeric' ? 'H.' : 'P.'}${data.book}.${data.verse}`;
    e.onmouseenter = () => {
      span.classList.remove('invisible');
    };
    e.onmouseleave = () => {
      span.classList.add('invisible');
    };
    e.appendChild(span);
    return e;
  }

  private titleElement({ type, data }: Annotation) {
    const e = document.createElement('div');
    e.classList.add('annotation', type, data.type, data.shape);
    const spanTitle = document.createElement('span');
    spanTitle.classList.add('invisible');
    spanTitle.innerHTML = `${data.text}`;
    e.onmouseenter = () => {
      spanTitle.classList.remove('invisible');
    };
    e.onmouseleave = () => {
      spanTitle.classList.add('invisible');
    };
    e.onclick = () => this.openAnnotation(data.description);
    e.appendChild(spanTitle);
    return e;
  }

  private scholieElement({ type, data }: Annotation) {
    const e = document.createElement('div');
    e.classList.add('annotation', type);
    e.classList.add(data.type);
    e.style.backgroundColor = data.color ?? e.style.backgroundColor;
    e.onclick = () => this.openAnnotation(data.description);
    return e;
  }

  private refElement({ type, data }: Annotation) {
    const e = document.createElement('div');
    e.classList.add('annotation', type, data.shape);
    e.style.backgroundColor = data.color ?? e.style.backgroundColor;
    const spanRef = document.createElement('span');
    spanRef.classList.add('invisible');
    spanRef.innerHTML = `${data.text}`;
    e.onmouseenter = () => {
      spanRef.classList.remove('invisible');
    };
    e.onmouseleave = () => {
      spanRef.classList.add('invisible');
    };
    e.appendChild(spanRef);
    e.onclick = () => this.openAnnotation(data.description);
    return e;
  }

  private variaElement({ type, data }: Annotation) {
    const e = document.createElement('div');
    e.classList.add('annotation', type, data.type);
    const spanVaria = document.createElement('span');
    spanVaria.classList.add('invisible');
    spanVaria.innerHTML = `${data.text}`;
    e.onmouseenter = () => {
      spanVaria.classList.remove('invisible');
    };
    e.onmouseleave = () => {
      spanVaria.classList.add('invisible');
    };
    e.appendChild(spanVaria);
    e.onclick = () => this.openAnnotation(data.description);
    return e;
  }

  private ornamentElement({ type, data }: Annotation) {
    const e = document.createElement('div');
    e.classList.add('annotation', type);
    const spanOrnament = document.createElement('span');
    spanOrnament.classList.add('invisible');
    spanOrnament.innerHTML = `${data.text}`;
    e.onmouseenter = () => {
      spanOrnament.classList.remove('invisible');
    };
    e.onmouseleave = () => {
      spanOrnament.classList.add('invisible');
    };
    e.onclick = () => this.openAnnotation(data.description);
    e.appendChild(spanOrnament);
    return e;
  }

  newAnnotation(a: Annotation): OsdAnnotation {
    return {
      id: uuid('annotation'),
      element: this.generateAnnotation[a.type](a),
      x: a.position.x,
      y: a.position.y,
      width: a.position.width,
      height: a.position.height,
      text: a.data.description,
      annotation: a,
    };
  }
}
