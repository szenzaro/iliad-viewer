import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Map, uuid } from '../utils/index';
import { Annotation, Chant, Verse, VerseRowType, Word, WordData } from '../utils/models';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnnotationModalComponent } from '../viewer/components/annotation-modal/annotation-modal.component';
import { OsdAnnotation } from '../viewer/components/openseadragon/openseadragon.component';

function mapWords(text: string, chant: number, position: number, verse: VerseRowType, data: WordData[]): Word[] {
  let id = `${text}.${chant}.${position}`;
  switch (verse[0]) {
    case 'o':
      id = `${id}.1`;
      return [{ id, text: 'OMISIT', data } as Word];
    case 'f':
      return verse[1].map((lemma) => ({ text: lemma } as Word));
    case 't':
      return verse[1].map((lemma) => ({ text: lemma } as Word));
    default: // "v"
      return verse[2].map((lemma, j) => ({ id: `${id}.${j + 1}`, text: lemma, data: data[j] } as Word));
  }
}

function getVerse(id: number, text: string, chant: number, verse: VerseRowType, data: WordData[]): Verse {
  return {
    id,
    n: verse[0] === 't' || verse[0] === 'f' ? verse[0] : verse[1],
    words: mapWords(text, chant, id, verse, data),
  };
}

function jsonToModelVerses(text: string, chant: number, verses: VerseRowType[], data: WordData[][]) {
  return verses
    .map((verse, i) => getVerse(verses[0][0] === 't' ? i : i + 1, text, chant, verse, data[i]));
}

function toWordData(versesData: [string, string, string][][]): WordData[][] {
  return versesData.map((verse) => verse
    .map((x) => x[0] === '' || x[1] === '' || x[2] === ''
      ? undefined
      : { normalized: x[0], lemma: x[1], tag: x[2] }));
}

interface TextItem {
  id: string;
  label: string;
  chants: number;
}

interface TextManifest {
  textsList: TextItem[];
  mainText: string;
}

type PageInfo = [number, [number, number], [number, number]];

@Injectable({
  providedIn: 'root'
})
export class TextService {

  cache: Map<any> = {};

  constructor(
    private readonly http: HttpClient,
    private readonly modalService: NgbModal,
  ) {
  }

  getPageFromVerse(text: string, chant: number, verse: number) {
    return this.cachedGet<PageInfo[][]>(`./assets/data/texts/${text}/pagesToVerses.json`)
      .pipe(
        map((pages: PageInfo[][]) => (pages.findIndex((x) => {
          const entry = x.filter((e) => e[0] === chant).map((v) => verse <= v[1][1] && verse >= v[1][0]);
          return entry.length > 0 && entry[0];
        }) + 1)),
      );
  }

  getVerses(text: string, chant: number, range?: [number, number]) {
    return forkJoin([
      this.cachedGet<Chant>(`./assets/data/texts/${text}/${chant}/verses.json`),
      this.cachedGet<[string, string, string][][]>(`./assets/data/texts/${text}/${chant}/data.json`),
    ]).pipe(
      map(([{ verses }, x]) => jsonToModelVerses(text, chant, verses, toWordData(x))),
      map((verses) => !!range ? verses.slice(range[0], range[1]) : verses)
    );
  }

  getVersesNumberFromPage(n: number, chant?: number) {
    return this.cachedGet<PageInfo[][]>(`./assets/manuscript/pagesToVerses.json`)
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
    return this.cachedGet<TextManifest>(`./assets/data/manifest.json`);
  }

  getPageNumbers(chant: number) {
    return this.cachedGet<number[][]>(`./assets/manuscript/booksToPages.json`)
      .pipe(
        map((pages) => pages[chant - 1]),
      );
  }

  // TODO: cache result in an internal data structure instead of http calls for every request
  getNumberOfChants(text: string) {
    return this.getTextsList()
      .pipe(
        map((textManifest) => {
          const textInfo = textManifest.textsList.find((x) => x.id === text);
          return textInfo.chants;
        }),
      );
  }

  getAnnotations() {
    return this.cachedGet<Annotation[]>(`./assets/manuscript/annotations.json`)
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
        element.onmouseenter = (e) => {
          span.classList.remove('invisible');
        };
        element.onmouseleave = (e) => {
          span.classList.add('invisible');
        };
        element.appendChild(span);
        break;
      case 'varia':
        element.classList.add(annotation.data.type);
        const spanVaria = document.createElement('span');
        spanVaria.classList.add('invisible');
        spanVaria.innerHTML = `${annotation.data.text}`;
        element.onmouseenter = (e) => {
          spanVaria.classList.remove('invisible');
        };
        element.onmouseleave = (e) => {
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
        element.onmouseenter = (e) => {
          spanRef.classList.remove('invisible');
        };
        element.onmouseleave = (e) => {
          spanRef.classList.add('invisible');
        };
        element.appendChild(spanRef);
        element.onclick = () => this.openAnnotation(annotation.data.description);
        break;
      case 'ornament':
        const spanOrnament = document.createElement('span');
        spanOrnament.classList.add('invisible');
        spanOrnament.innerHTML = `${annotation.data.text}`;
        element.onmouseenter = (e) => {
          spanOrnament.classList.remove('invisible');
        };
        element.onmouseleave = (e) => {
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
        element.onmouseenter = (e) => {
          spanTitle.classList.remove('invisible');
        };
        element.onmouseleave = (e) => {
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

  private cachedGet<T>(path: string) {
    return !!this.cache[path]
      ? of<T>(this.cache[path])
      : this.http.get<T>(path).pipe(tap((x) => this.cache[path] = x));
  }
}
