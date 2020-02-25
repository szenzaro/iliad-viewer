import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of } from 'rxjs';
import { filter, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';
import { arrayToMap, Map, uuid } from '../utils/index';
import { Annotation, AnnotationType, Chant, Verse, VerseRowType, Word, WordData } from '../utils/models';
import { AnnotationModalComponent } from '../viewer/components/annotation-modal/annotation-modal.component';
import { OsdAnnotation } from '../viewer/components/openseadragon/openseadragon.component';
import { CacheService } from './cache.service';

function mapWords(text: string, chant: number, verse: VerseRowType, data: WordData[], verseNumber: number): Word[] {
  switch (verse[0]) {
    case 'o':
      return [{ text: 'OMISIT', data } as unknown as Word];
    case 'f':
      return verse[1].map((lemma) => ({ text: lemma } as Word));
    case 't':
      return verse[1].map((lemma) => ({ text: lemma } as Word));
    default: // "v"
      return verse[2].map((lemma, j) => ({
        id: `${data[j] && data[j].id}`,
        text: lemma,
        data: data[j],
        verse: verseNumber,
        chant,
        source: text,
      } as Word));
  }
}

function getVersesFromCache(verses: Verse[], range?: [number, number]) {
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

function getVerse(id: number, text: string, chant: number, verse: VerseRowType, data: WordData[]): Verse {
  const verseN = verse[0] === 't' || verse[0] === 'f' ? verse[0] : verse[1];
  return {
    id,
    n: verseN,
    words: mapWords(text, chant, verse, data, +verseN),
  };
}

function jsonToModelVerses(text: string, chant: number, verses: VerseRowType[], data: WordData[][]) {
  return verses
    .map((verse, i) => getVerse(verses[0][0] === 't' ? i : i + 1, text, chant, verse, data[i]));
}

function toWordData(versesData: Array<Array<[string, string, string, string]>>): WordData[][] {
  return versesData.map((verse) => verse
    .map((x) => x[0] === '' || x[1] === '' || x[2] === ''
      ? undefined
      : { normalized: x[0], lemma: x[1], tag: x[2], id: x[3] }));
}

export interface TextItem {
  id: string;
  label: string;
  chants: number;
}

interface TextManifest {
  textsList: TextItem[];
  mainText: string;
  alignments: AlignmentItem[];
}

interface AlignmentItem {
  source: string;
  target: string;
  type: string;
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

  constructor(
    private readonly cacheService: CacheService,
    private readonly modalService: NgbModal,
  ) {
  }

  manifest = this.cacheService.cachedGet<TextManifest>('./assets/data/manifest.json').pipe(shareReplay(1));

  getPageFromVerse(chant: number, verse: number) {
    return this.cacheService.cachedGet<{ [key: string]: PageInfo[] }>('./assets/manuscript/pagesToVerses.json')
      .pipe(
        map((pages) => +(Object.keys(pages).find((x) => {
          const entry = pages[x].filter((e) => e[0] === chant).map((v) => verse <= v[1][1] && verse >= v[1][0]);
          return entry.length > 0 && entry[0];
        }))),
      );
  }

  getVerses(text: string, chant: number, range?: [number, number]) {
    const cacheKey = `${text}-c${chant}`;
    if (!!this.cacheService.cache[cacheKey]) {
      of<Verse[]>(getVersesFromCache(this.cacheService.cache[cacheKey]));
    }
    return forkJoin([
      this.cacheService.cachedGet<Chant>(`./assets/data/texts/${text}/${chant}/verses.json`),
      this.cacheService.cachedGet<Array<Array<[string, string, string, string]>>>(`./assets/data/texts/${text}/${chant}/data.json`),
    ]).pipe(
      map(([{ verses }, x]) => jsonToModelVerses(text, chant, verses, toWordData(x))),
      tap((verses) => this.cacheService.cache[cacheKey] = verses),
      map((verses) => getVersesFromCache(verses, range)),
    );
  }

  getVerseFromNumber(text: string, chant: number, n: number) {
    return this.getVerses(text, chant).pipe(
      map((verses) => verses.find((v) => v.n === n)),
    );
  }

  getWords(text: string) {
    if (!this.cacheService.cache[`words-${text}`]) {
      return this.getTextsList().pipe(
        map((x) => x.textsList.find((txt) => txt.id === text)),
        filter((x) => !!x),
        map(({ chants }) => new Array(chants).fill(0).map((_, i) => i + 1)),
        map((chantNums) => chantNums.map((n) => this.getVerses(text, n))),
        map((x) => forkJoin(x)),
        switchMap((x) => x),
        map((verses) => verses.reduce((x, v) => x.concat(v), [])),
        map((verses) => verses.reduce((x, v) => x.concat(v.words), []) as Word[]),
        map((words) => arrayToMap(words, 'id')),
      );
    }
    return of<Map<Word>>(this.cacheService.cache[`words-${text}`] as Map<Word>);
  }

  getVersesNumberFromPage(n: number, chant?: number) {
    return this.cacheService.cachedGet<{ [key: string]: PageInfo[] }>('./assets/manuscript/pagesToVerses.json')
      .pipe(
        map((pages) => {
          const entry = chant !== undefined
            ? pages[`${n}`].find((x) => x[0] === chant)
            : pages[`${n}`][pages[`${n}`].length - 1];
          return !!entry && [entry[1], entry[2]] as [[number, number], [number, number]];
        }),
      );
  }

  getTextsList() {
    return this.cacheService.cachedGet<TextManifest>('./assets/data/manifest.json');
  }

  getPageNumbers(chant: number) {
    return this.cacheService.cachedGet<number[][]>('./assets/manuscript/booksToPages.json')
      .pipe(
        map((pages) => pages[chant - 1]),
      );
  }

  getNumberOfChants(text: string) {
    return this.getTextsList()
      .pipe(
        map((textManifest) => {
          const textInfo = textManifest.textsList.find((x) => x.id === text);
          return textInfo.chants;
        }),
      );
  }

  getChantsPages(text: string) {
    return this.getNumberOfChants(text).pipe(
      map((n) => new Array(n).fill(0).map((_, i) => i + 1)),
      mergeMap((ns) => forkJoin(ns.map((x) => this.getPageNumbers(x))).pipe(
        map((x) => {
          const m: Map<number[]> = {};
          x.forEach((n, i) => m[i + 1] = n);
          return m;
        }),
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
