import { Component, EventEmitter, Output } from '@angular/core';
import { faSearch, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';
import { SearchQuery } from 'src/app/services/search.service';
import { TextService, TextItem } from 'src/app/services/text.service';


function removePunctuation(s: string) {
  return s.replace(/[.,\/#!$%\\[\]^&\*;:{}=\-_`~()]/g, '').replace(/\s{2,}/g, ' ');
}

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
    alignment: true,
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
    map((x) => x.map(({ id }) => id)),
  );

  faSearch = faSearch;
  faSlidersH = faSlidersH;

  get sourceText() {
    return { id: this.searchQuery.texts[0], label: this.searchQuery.texts[0] };
  }

  set sourceText(t: Partial<TextItem>) {
    if (!!t) {
      this.searchQuery.texts[0] = t.id;
    }
  }

  get targetText() {
    return { id: this.searchQuery.texts[1], label: this.searchQuery.texts[1] };
  }

  set targetText(t: Partial<TextItem>) {
    if (!!t) {
      this.searchQuery.texts[1] = t.id;
    }
  }

  constructor(
    private textService: TextService,
  ) {
  }

  checkChange(x: SearchQuery) {
    const cleanText = removePunctuation(x.text);
    if (cleanText !== '') {
      this.queryChange.next({ ...x, text: cleanText });
    }
  }
}
