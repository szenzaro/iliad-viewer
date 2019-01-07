import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Map } from '../utils/index';
import { Chant, Verse, VerseRowType, Word, WordData } from '../utils/models';

import { createAnnotation, OsdAnnotation } from '../viewer/components/openseadragon/openseadragon.component';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

function mapWords(text: string, chant: number, position: number, verse: VerseRowType, data: WordData[]): Word[] {
  let id = `${text}.${chant}.${position}`;
  switch (verse[0]) {
    case 'o':
      id = `${id}.1`;
      return [{ id, text: 'OMISIT', data } as Word];
    case 'f':
      return verse[1].map((lemma, j) => ({ text: lemma } as Word));
    case 't':
      return verse[1].map((lemma, j) => ({ text: lemma } as Word));
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
    .map((verse, i) => ({
      id: i + 1,
      n: verse[0] === 't' || verse[0] === 'f' ? verse[0] : verse[1],
      words: mapWords(text, chant, i + 1, verse, data[i]),
    } as Verse));
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

type PageInfo = [number, [number, number]];

@Injectable({
  providedIn: 'root'
})
export class TextService {


  constructor(private readonly http: HttpClient) {
  }

  getVerses(text: string, chant: number, range?: [number, number]) {
    return forkJoin(
      this.http.get<Chant>(`./assets/texts/${text}/${chant}/verses.json`),
      this.http.get<[string, string, string][][]>(`./assets/texts/${text}/${chant}/data.json`),
    ).pipe(
      map(([{ verses }, x]) => jsonToModelVerses(text, chant, verses, toWordData(x))),
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
