import { Component, EventEmitter, Input, Output } from '@angular/core';
import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';
import { faExchangeAlt, faSearch, } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { map, take } from 'rxjs/operators';
import { AlignmentLabels, AlignmentService } from 'src/app/services/alignment.service';
import { SearchQuery, SearchService } from 'src/app/services/search.service';
import { TextItem, TextService } from 'src/app/services/text.service';

function removePunctuation(s: string) {
  return s.replace(/[.,\/#!$%\\[\]^&\*;:{}=\-_`~()]/g, '').replace(/\s{2,}/g, ' ');
}

function getTextOption(id: string, textService: TextService, ts: TranslateService) {
  return textService.textList.pipe(
    map((tl) => tl.filter((t) => t.id === id)[0].label),
    take(1),
    map((label) => ({ id, label: ts.instant(_T(label)) })),
  )
    ;
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
    { id: 'pos', label: this.ts.instant(_T('POS')) },
  ];
  readonly alignmentTypes = this.alignmentService.alignmentTypes.pipe(
    map((types) => types.map((id) => ({ id, label: this.ts.instant(AlignmentLabels[id]) }))),
  );

  texts = this.textService.textList.pipe(
    map((x) => x
      .filter((t) => t.searchable)
      .map(({ id, label }) => ({ id, label: this.ts.instant(_T(label)) }))),
  );

  faSearch = faSearch;
  faExchange = faExchangeAlt;

  get sqText() { return this.searchQuery.text; }
  set sqText(s: string) { this.searchQuery.text = s.trim(); }

  get sourceText() {
    return getTextOption(this.searchQuery.texts[0], this.textService, this.ts);
  }

  set sourceTextValue(t: Partial<TextItem>) {
    if (!!t) {
      this.searchQuery.texts[0] = t.id;
    }
  }

  get targetText() {
    return getTextOption(this.searchQuery.texts[1], this.textService, this.ts);
  }

  set targetTextValue(t: Partial<TextItem>) {
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

  switchExactMatch(x: 'text' | 'lemma' | 'pos') {
    this.searchQuery.exactMatch = x === 'lemma';
  }

  selectCmp(a: Partial<{ id: string }>, b: Partial<{ id: string }>) { return a.id === b.id; }
}
