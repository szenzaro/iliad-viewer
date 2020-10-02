import { Component, EventEmitter, Input, Output } from '@angular/core';
import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';
import { faExchangeAlt, faSearch, } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { AlignmentLabels, AlignmentService } from 'src/app/services/alignment.service';
import { SearchQuery, SearchService } from 'src/app/services/search.service';
import { TextItem, TextService } from 'src/app/services/text.service';
import { capitalize } from 'src/app/utils';

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

  isCollapsed = true;
  searchQuery: SearchQuery = { ...this.searchService.defaultQuery };

  @Input() set query(q: SearchQuery) {
    if (!!q) {
      this.searchQuery = { ...q };
    }
  }
  get query() { return this.searchQuery; }
  set alignment(v: boolean) {
    this.searchQuery.alignment = v;
    if (this.searchQuery.alignment && this.searchQuery.texts.length < 2) {
      this.searchQuery.texts = this.searchService.defaultQuery.texts;
    }
  }
  get alignment() { return this.searchQuery.alignment; }

  indexes = [
    { id: 'text', label: this.ts.instant(_T('Form')) },
    { id: 'lemma', label: this.ts.instant(_T('Lemma')) },
  ];
  readonly alignmentTypes = this.alignmentService.alignmentTypes.pipe(
    map((types) => types.map((id) => ({ id, label: this.ts.instant(AlignmentLabels[id]) }))),
  );

  texts = this.textService.textList.pipe(
    map((x) => x.map(({ id }) => id)),
  );

  faSearch = faSearch;
  faExchange = faExchangeAlt;

  get sourceText() {
    return { id: this.searchQuery.texts[0], label: capitalize(this.searchQuery.texts[0]) };
  }

  set sourceText(t: Partial<TextItem>) {
    if (!!t) {
      this.searchQuery.texts[0] = t.id;
    }
  }

  get targetText() {
    return { id: this.searchQuery.texts[1], label: capitalize(this.searchQuery.texts[1]) };
  }

  set targetText(t: Partial<TextItem>) {
    if (!!t) {
      this.searchQuery.texts[1] = t.id;
    }
  }

  get searchDisabled() {
    return (this.searchQuery.text.length < 2 && this.searchQuery.alignment && !this.searchQuery.pos) ||
      (this.searchQuery.pos && this.searchQuery.wFilter?.wfilter.length === 0) ||
      (Array.from(new Set(this.searchQuery.texts)).length < 1);
  }

  constructor(
    private textService: TextService,
    private searchService: SearchService,
    private alignmentService: AlignmentService,
    private ts: TranslateService,
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

  switchExactMatch(x: 'text' | 'lemma') {
    this.searchQuery.exactMatch = x === 'lemma';
  }
}
