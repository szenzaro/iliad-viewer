import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, of } from 'rxjs';
import { combineLatest, filter, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';
import { arrayToMap, Map, uuid } from '../utils/index';
import { Annotation, Chant, Verse, VerseRowType, Word, WordData } from '../utils/models';
import { AnnotationModalComponent } from '../viewer/components/annotation-modal/annotation-modal.component';
import { OsdAnnotation } from '../viewer/components/openseadragon/openseadragon.component';
import { CacheService } from './cache.service';

function mapWords(text: string, chant: number, verse: VerseRowType, data: WordData[], verseNumber: number): Word[] {
  switch (verse[0]) {
    case 'o':
      return [{ text: 'OMISIT', data } as Word];
    case 'f':
      return verse[1].map((lemma) => ({ text: lemma } as Word));
    case 't':
      return verse[1].map((lemma) => ({ text: lemma } as Word));
    default: // "v"
      return verse[2].map((lemma, j) => ({
        id: `${data[j] && data[j].id}`,
        text: lemma, data: data[j],
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
    console.log('!TTT!', verses[lIndex - 1]);
    vs = [verses[lIndex - 1]].concat(vs);
  }

  if (vs.some((v) => v.n === 't' || v.n === 'f')) {
    console.log('HERE', vs);
  }

  if (!!verses[rIndex + 1] && verses[rIndex + 1].n === 'f') {
    console.log('!FFFF!', verses[rIndex + 1]);
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

function toWordData(versesData: [string, string, string, string][][]): WordData[][] {
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
  alignments: { source: string, target: string }[];
}

type PageInfo = [number, [number, number], [number, number]];

interface AlignmentEntry {
  type: 'sub' | 'ins' | 'del' | 'eq';
  source: string[];
  target: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TextService {

  cache: Map<any> = {};

  constructor(
    private readonly cacheService: CacheService,
    private readonly modalService: NgbModal,
  ) {
    this.alignments.subscribe();
  }

  private manifest = this.cacheService.cachedGet<TextManifest>(`./assets/data/manifest.json`).pipe(shareReplay(1));

  private alignments = this.manifest.pipe(
    map(({ alignments }) => alignments),
    map((al) => al.map(({ source, target }) => `./assets/data/alignments/${source}-${target}.json`)),
    map((al) => al.map((a) => this.cacheService.cachedGet<Map<AlignmentEntry>>(a))),
    switchMap((al) => forkJoin(al).pipe(
      combineLatest(this.manifest),
      map(([als, { alignments }]) => {
        const ret: Map<Map<AlignmentEntry>> = {};
        alignments.forEach((a, i) => {
          ret[`${alignments[i].source}-${alignments[i].target}`] = als[i];
        });
        return ret;
      })
    )),
    shareReplay(1),
  );

  getAlignment(source: string, target: string, wordId: string) {
    return this.alignments
      .pipe(
        map((alignment) => alignment[`${source}-${target}`][wordId]), // Can be undefined!
      );
  }

  getPageFromVerse(chant: number, verse: number) {
    return this.cacheService.cachedGet<PageInfo[][]>(`./assets/manuscript/pagesToVerses.json`)
      .pipe(
        map((pages: PageInfo[][]) => (pages.findIndex((x) => {
          const entry = x.filter((e) => e[0] === chant).map((v) => verse <= v[1][1] && verse >= v[1][0]);
          return entry.length > 0 && entry[0];
        }) + 1)),
      );
  }

  getVerses(text: string, chant: number, range?: [number, number]) {
    const cacheKey = `${text}-c${chant}`;
    if (!!this.cache[cacheKey]) {
      return of<Verse[]>(!!range ? this.cache[cacheKey].slice(range[0], range[1]) : this.cache[cacheKey]);
    }
    return forkJoin([
      this.cacheService.cachedGet<Chant>(`./assets/data/texts/${text}/${chant}/verses.json`),
      this.cacheService.cachedGet<[string, string, string, string][][]>(`./assets/data/texts/${text}/${chant}/data.json`),
    ]).pipe(
      map(([{ verses }, x]) => jsonToModelVerses(text, chant, verses, toWordData(x))),
      tap((verses) => this.cache[cacheKey] = verses),
      map((verses) => !!range ? verses.slice(range[0], range[1]) : verses),
    );
  }

  getVerseFromNumber(text: string, chant: number, n: number) {
    return this.getVerses(text, chant).pipe(
      map((verses) => verses.find((v) => v.n === n)),
    );
  }

  getWords(text: string) {
    if (!this.cache[`words-${text}`]) {
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
    return of<Map<Word>>(this.cache[`words-${text}`] as Map<Word>);
  }

  getVersesNumberFromPage(n: number, chant?: number) {
    return this.cacheService.cachedGet<PageInfo[][]>(`./assets/manuscript/pagesToVerses.json`)
      .pipe(
        map((pages: PageInfo[][]) => {
          const entry = chant !== undefined
            ? pages[n - 1].find((x) => x[0] === chant)
            : pages[n - 1][pages[n - 1].length - 1];
          return !!entry && [entry[1], entry[2]] as [[number, number], [number, number]];
        }),
      );
  }

  getTextsList() {
    return this.cacheService.cachedGet<TextManifest>(`./assets/data/manifest.json`);
  }

  getPageNumbers(chant: number) {
    return this.cacheService.cachedGet<number[][]>(`./assets/manuscript/booksToPages.json`)
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
    return this.cacheService.cachedGet<Annotation[]>(`./assets/manuscript/annotations.json`)
      .pipe(
        map((arr) => {
          const annotations: Map<OsdAnnotation[]> = {};
          arr.forEach((a) => {
            if (!annotations[a.page]) {
              annotations[a.page] = [];
            }
            annotations[a.page].push(this.newAnnotation(a));
          });
          return annotations;
        }),
      );
  }

  openAnnotation(text: string) {
    const modalRef = this.modalService.open(AnnotationModalComponent);
    (modalRef.componentInstance as AnnotationModalComponent).text = text;
  }

  newAnnotation(annotation: Annotation): OsdAnnotation {
    const element = document.createElement('div');
    element.classList.add('annotation', annotation.type);

    switch (annotation.type) { // TODO: refactor this switch
      case 'verse':
        element.classList.add(annotation.data.type);
        element.classList.add(annotation.data.shape);
        const span = document.createElement('span');
        span.classList.add('invisible');
        span.innerHTML = `${annotation.data.type === 'homeric' ? 'H.' : 'P.'}${annotation.data.book}.${annotation.data.verse}`;
        element.onmouseenter = () => {
          span.classList.remove('invisible');
        };
        element.onmouseleave = () => {
          span.classList.add('invisible');
        };
        element.appendChild(span);
        break;
      case 'varia':
        element.classList.add(annotation.data.type);
        const spanVaria = document.createElement('span');
        spanVaria.classList.add('invisible');
        spanVaria.innerHTML = `${annotation.data.text}`;
        element.onmouseenter = () => {
          spanVaria.classList.remove('invisible');
        };
        element.onmouseleave = () => {
          spanVaria.classList.add('invisible');
        };
        element.appendChild(spanVaria);
        element.onclick = () => this.openAnnotation(annotation.data.description);
        break;
      case 'ref':
        element.classList.add(annotation.data.shape);
        if (!!annotation.data.color) {
          element.style.backgroundColor = annotation.data.color;
        }
        const spanRef = document.createElement('span');
        spanRef.classList.add('invisible');
        spanRef.innerHTML = `${annotation.data.text}`;
        element.onmouseenter = () => {
          spanRef.classList.remove('invisible');
        };
        element.onmouseleave = () => {
          spanRef.classList.add('invisible');
        };
        element.appendChild(spanRef);
        element.onclick = () => this.openAnnotation(annotation.data.description);
        break;
      case 'ornament':
        const spanOrnament = document.createElement('span');
        spanOrnament.classList.add('invisible');
        spanOrnament.innerHTML = `${annotation.data.text}`;
        element.onmouseenter = () => {
          spanOrnament.classList.remove('invisible');
        };
        element.onmouseleave = () => {
          spanOrnament.classList.add('invisible');
        };
        element.onclick = () => this.openAnnotation(annotation.data.description);
        element.appendChild(spanOrnament);
        break;
      case 'scholie':
        element.classList.add(annotation.data.type);
        if (!!annotation.data.color) {
          element.style.backgroundColor = annotation.data.color;
        }
        element.onclick = () => this.openAnnotation(annotation.data.description);
        break;
      case 'title':
        element.classList.add(annotation.data.type);
        element.classList.add(annotation.data.shape);
        const spanTitle = document.createElement('span');
        spanTitle.classList.add('invisible');
        spanTitle.innerHTML = `${annotation.data.text}`;
        element.onmouseenter = () => {
          spanTitle.classList.remove('invisible');
        };
        element.onmouseleave = () => {
          spanTitle.classList.add('invisible');
        };
        element.onclick = () => this.openAnnotation(annotation.data.description);
        element.appendChild(spanTitle);
        break;
    }

    return {
      id: uuid('annotation'),
      element,
      x: annotation.position.x,
      y: annotation.position.y,
      width: annotation.position.width,
      height: annotation.position.height,
      text: annotation.data.description,
      annotation,
    };
  }
}
