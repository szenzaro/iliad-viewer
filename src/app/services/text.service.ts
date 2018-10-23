import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Verse, Word, Chant } from '../utils/models';

import { map } from 'rxjs/operators';

function jsonToModelVerses(chant: number, verses: string[][]) {
  return verses
    .map((verse, i) => ({
      n: i + 1,
      words: verse.map((lemma, j) => ({ id: `${chant}.${i + 1}.${j + 1}`, lemma } as Word)),
    } as Verse));
}

@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor(private readonly http: HttpClient) { }

  getVerses(text: string, chant: number): Observable<Verse[]> {
    return this.http.get(`./assets/texts/${text}/${chant}/verses.json`)
      .pipe(
        tap((x: Chant) => console.log(x)),
        map(({ verses }: Chant) => verses
          .map((verse, i) => ({
            n: i + 1,
            words: verse.map((lemma, j) => ({ id: `${chant}.${i + 1}.${j + 1}`, lemma } as Word)),
          } as Verse))),
      );
  }
}
