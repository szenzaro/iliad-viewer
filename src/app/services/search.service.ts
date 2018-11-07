import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export interface SearchResult {
  query: string;
  result: string; // TODO: this should not be a string but a structured result
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  results = new BehaviorSubject<SearchResult[]>([]);

  search(query: string) {
    const resultsNumber = Math.floor(Math.random() * 9) + 1;

    this.results.next(new Array(resultsNumber).fill({ query, result: 'Test Result' }));
    // TODO: replace mock result with real results
  }

}
