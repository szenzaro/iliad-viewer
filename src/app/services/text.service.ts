import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Map } from '../utils/index';
import { Chant, Verse, VerseRowType, Word } from '../utils/models';

import { createAnnotation, OsdAnnotation } from '../viewer/components/openseadragon/openseadragon.component';

import { map } from 'rxjs/operators';

function mapWords(chant: number, position: number, verse: VerseRowType): Word[] {
  let id = `${chant}.${position}`;
  switch (verse[0]) {
    case 'o':
      id = `${id}.1`;
      return [{ id, lemma: 'OMISIT' } as Word];
    case 'f':
      return verse[1].map((lemma, j) => ({ id: `${id}.${j + 1}`, lemma } as Word));
    case 't':
      return verse[1].map((lemma, j) => ({ id: `${id}.${j + 1}`, lemma } as Word));
    default: // "v"
      return verse[2].map((lemma, j) => ({ id: `${id}.${j + 1}`, lemma } as Word));
  }
}

function jsonToModelVerses(chant: number, verses: VerseRowType[]) {
  return verses
    .map((verse, i) => ({
      id: i + 1,
      n: verse[0] === 't' || verse[0] === 'f' ? verse[0] : verse[1],
      words: mapWords(chant, i + 1, verse),
    } as Verse));
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

type PageInfo = [number, [number, number]];

@Injectable({
  providedIn: 'root'
})
export class TextService {


  constructor(private readonly http: HttpClient) {
  }

  getVerses(text: string, chant: number, range?: [number, number]) {
    return this.http.get(`./assets/texts/${text}/${chant}/verses.json`)
      .pipe(
        map(({ verses }: Chant) => jsonToModelVerses(chant, verses)),
        map((verses) => !!range ? verses.slice(range[0], range[1]) : verses)
      );
  }

  getVersesNumberFromPage(text: string, n: number, chant?: number, ) {
    return this.http.get(`./assets/texts/${text}/pagesToVerses.json`)
      .pipe(
        map((pages: PageInfo[]) => chant !== undefined
          ? pages[n].find((x) => x[0] === chant) // TODO check correctness
          : pages[n][pages[n].length - 1]),
      );
  }

  getTextsList() {
    return this.http.get<TextManifest>(`./assets/texts/texts-manifest.json`);
  }

  getPageNumbers(text: string, chant: number) {
    return this.http.get(`./assets/texts/${text}/booksToPages.json`)
      .pipe(
        map((pages: number[][]) => pages[chant - 1]),
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
    return this.http.get(`./assets/manuscript/annotations.json`)
      .pipe(
        map((arr: { page: number, text: string, x: number, y: number, width: number, height: number }[]) => {
          const annotations: Map<OsdAnnotation[]> = {};
          arr.forEach(({ page, text, x, y, width, height }) => {
            if (!annotations[page]) {
              annotations[page] = [];
            }
            annotations[page].push(createAnnotation(text, x, y, width, height));
          });
          return annotations;
        }),
      );
  }
}
