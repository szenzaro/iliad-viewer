import { Component, EventEmitter, Output } from '@angular/core';
import { faSearch, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';
import { SearchQuery } from 'src/app/services/search.service';
import { TextService } from 'src/app/services/text.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {

  @Output() queryChange = new EventEmitter<SearchQuery>();

  defaultQuery: SearchQuery = {
    text: '',
    diacriticSensitive: false,
    caseSensitive: false,
    exactMatch: false,
    alignment: false, // TODO: make default true
    pos: false,
    index: 'text',
    mode: 'words',
    texts: ['homeric', 'paraphrase'],
    posFilter: undefined,
  };
  isCollapsed = true;
  searchQuery: SearchQuery = { ...this.defaultQuery };

  indexes = [{ id: 'text', label: 'Text' }, { id: 'lemma', label: 'Lemma' }];

  texts = this.textService.getTextsList().pipe(
    map((manifest) => manifest.textsList),
    map((x) => x.map(({id}) => id)),
  );

  faSearch = faSearch;
  faSlidersH = faSlidersH;

  constructor(
    private textService: TextService,
  ) {
  }
}
