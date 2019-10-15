import { Component, EventEmitter, Output } from '@angular/core';
import { faExchangeAlt, faSearch, } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';
import { SearchQuery } from 'src/app/services/search.service';
import { TextItem, TextService } from 'src/app/services/text.service';


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
  faExchange = faExchangeAlt;

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

  get searchDisabled() {
    return Array.from(new Set(this.searchQuery.texts)).length < 2 ||
      (this.searchQuery.text.length === 0 && !this.searchQuery.pos);
  }

  constructor(
    private textService: TextService,
  ) {
  }

  swapTexts() {
    this.searchQuery.texts = this.searchQuery.texts.reverse();
  }

  checkChange(x: SearchQuery) {
    const cleanText = removePunctuation(x.text);
    if (cleanText !== '') {
      this.queryChange.next({ ...x, text: cleanText });
    }
  }
}
