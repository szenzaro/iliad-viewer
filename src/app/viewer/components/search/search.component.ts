import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { SearchService } from 'src/app/services/search.service';
import { groupBy, Map } from 'src/app/utils';
import { Word } from 'src/app/utils/models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {

  results = this.searchService.results.pipe(
    map((x) => groupBy(x, 'source')),
    map((x) => {
      const keys = Object.keys(x);
      const m: Map<Map<Word[]>> = {};
      keys.forEach((k) => m[k] = groupBy(x[k], 'chant'));
      keys.forEach((text) => Object.keys(m[text])
        .forEach((chant) => m[text][chant] = m[text][chant].sort((w1, w2) => w1.verse - w2.verse)));
      return m;
    }),
  );

  constructor(
    public readonly searchService: SearchService,
  ) {
  }
}
