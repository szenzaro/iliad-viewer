import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor(private readonly http: HttpClient) { }

  getVerses(text: string, chant: number) {
    return this.http.get(`./assets/texts/${text}/${chant}/verses.json`);
  }
}
