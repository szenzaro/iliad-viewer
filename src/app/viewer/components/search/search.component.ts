import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
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

  faSearch = faSearch;
  searchTextbox = new FormControl();
  results = this.searchService.results.pipe(
    map((x) => groupBy(x, 'source')),
    map((x) => {
      const keys = Object.keys(x);
      const m: Map<Map<Word[]>> = {};
      keys.forEach((k) => m[k] = groupBy(x[k], 'chant'));
      return m;
    })
  );

  constructor(
    public searchService: SearchService,
  ) {
  }

  search() {
    this.searchService.queryString.next(this.searchTextbox.value);
  }
}
