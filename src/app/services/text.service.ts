import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chant, Verse, Word } from '../utils/models';

import { Map } from '../utils/index';
import { createAnnotation, OsdAnnotation } from '../viewer/components/openseadragon/openseadragon.component';

import { map } from 'rxjs/operators';

function jsonToModelVerses(chant: number, verses: string[][]) {
  return verses
    .map((verse, i) => ({
      n: i + 1,
      words: verse.map((lemma, j) => ({ id: `${chant}.${i + 1}.${j + 1}`, lemma } as Word)),
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
