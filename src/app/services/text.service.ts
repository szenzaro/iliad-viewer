import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TextService {

  constructor(private readonly http: HttpClient) { }

  getText() {
    return this.http.get('./assets/texts/test.json');
  }
}
