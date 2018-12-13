import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { tagToDescription } from '../utils';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.scss'],
})
export class AboutPageComponent {

  tags = forkJoin(
    this.http.get<string[][]>(`./assets/texts/homeric/1/data.json`),
    this.http.get<string[][]>(`./assets/texts/homeric/2/data.json`),
    this.http.get<string[][]>(`./assets/texts/homeric/3/data.json`),
  ).pipe(
    map(([x, y, z]) => [
      x.reduce((a, b) => a.concat(b), []).map((t) => t[2]),
      y.reduce((a, b) => a.concat(b), []).map((t) => t[2]),
      z.reduce((a, b) => a.concat(b), []).map((t) => t[2]),
    ].reduce((a, b) => a.concat(b), [])),
    map((x) => x.map((t, i) => ({ tag: tagToDescription(t), i: i + 2 }))),
    map((x) => x.filter((t) => t.tag.includes('ERROR'))), // .sort()),
    // map((x) => x.map((t) => t.match(/\((.*)\)/)[1])),
    // map((x) => ({ n: x.length, tags: Array.from(new Set(x))})),
    map((x) => ({ n: x.length, tags: x })),
  );

  constructor(private readonly http: HttpClient) {
  }

}
