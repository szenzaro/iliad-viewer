import { Component, EventEmitter, Output } from '@angular/core';
import { faSearch, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SearchQuery } from 'src/app/services/search.service';
import { TextItem, TextService } from 'src/app/services/text.service';
import { InSubject } from '../../utils/InSubject';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent {

  @InSubject() selectedTexts: TextItem[];
  selectedTextsChange = new BehaviorSubject<TextItem[]>([]);

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
  };
  isCollapsed = true;
  searchQuery: SearchQuery = { ...this.defaultQuery };

  indexes = [{ id: 'text', label: 'Text' }, { id: 'lemma', label: 'Lemma' }];

  texts = this.textService.getTextsList().pipe(
    map((manifest) => manifest.textsList),
    tap((x) => this.selectedTexts = [x[0]]),
    tap((x) => this.searchQuery.texts = [x[0].id]),
  );

  faSearch = faSearch;
  faSlidersH = faSlidersH;

  constructor(
    private textService: TextService,
  ) {
  }
}
