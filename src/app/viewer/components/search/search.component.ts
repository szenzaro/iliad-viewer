import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {

  faSearch = faSearch;
  searchTextbox = new FormControl();

  constructor(
    public searchService: SearchService,
  ) {
  }

  search() {
    this.searchService.search(this.searchTextbox.value);
  }
}
