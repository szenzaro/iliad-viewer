import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chant, Verse, Word } from '../utils/models';

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

  getVersesNumberFromPage(text: string, chant: number, n: number) {
    return this.http.get(`./assets/texts/${text}/${chant}/pages.json`)
      .pipe(
        map((pages: number[][]) => pages[n] as [number, number]),
      );
  }

  getTextsList() {
    return this.http.get<TextManifest>(`./assets/texts/texts-manifest.json`);
  }

  getNumberOfPages(text: string, chant: number) {
    return this.http.get(`./assets/texts/${text}/${chant}/pages.json`)
      .pipe(
        map((pages: number[][]) => pages.length),
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
}
