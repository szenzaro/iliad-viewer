import { Component } from '@angular/core';
import { faSearch, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SearchQuery, SearchService } from 'src/app/services/search.service';
import { TextItem, TextService } from 'src/app/services/text.service';
import { groupBy, Map } from 'src/app/utils';
import { Word } from 'src/app/utils/models';
import { InSubject } from '../../utils/InSubject';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {

  defaultQuery: SearchQuery = {
    text: '',
    ignoreAccents: false,
    ignoreCase: false,
    index: 'text',
    mode: 'words',
    texts: [],
  };
  isCollapsed = true;
  searchQuery: SearchQuery = { ...this.defaultQuery };

  @InSubject() selectedTexts: TextItem[];
  selectedTextsChange = new BehaviorSubject<TextItem[]>([]);

  set selectedTextsIds(texts: TextItem[]) {
    this.searchQuery.texts = texts.map((t) => t.id);
  }

  texts = this.textService.getTextsList().pipe(
    map((manifest) => manifest.textsList),
    tap((x) => this.selectedTexts = [x[0]]),
    tap((x) => this.searchQuery.texts = [x[0].id]),
  );

  sourceText: string;
  targetText: string;

  indexes = [{ id: 'text', label: 'Text' }, { id: 'lemma', label: 'Lemma' }];

  mode: 'words' | 'alignment' = 'words';

  faSearch = faSearch;
  faSlidersH = faSlidersH;
  
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
    public searchService: SearchService,
    private textService: TextService,
  ) {
  }

  search() {
    this.searchService.queryString.next(this.searchQuery);
  }
}
