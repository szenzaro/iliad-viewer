import { Component, Input } from '@angular/core';
import { InSubject } from '../../utils/InSubject';

import { TextService } from 'src/app/services/text.service';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap, skip } from 'rxjs/operators';
import { Annotation, RecursivePartial } from 'src/app/utils/models';

@Component({
  selector: 'app-manuscript',
  templateUrl: './manuscript.component.html',
  styleUrls: ['./manuscript.component.scss'],
})
export class ManuscriptComponent {

  @Input() @InSubject() currentPage: number;
  currentPageChange = new BehaviorSubject<number>(110);
  @Input() @InSubject() currentChant: number;
  currentChantChange = new BehaviorSubject<number>(3);

  @InSubject() manuscriptPage: number;
  manuscriptPageChange = new BehaviorSubject<number>(109);

  text = 'homeric';

  annotations = this.textService.getAnnotations();
  @Input() @InSubject() annotationsFilter: RecursivePartial<Annotation>[];
  annotationsFilterChange = new BehaviorSubject<RecursivePartial<Annotation>[]>([]);

  filteredAnnotations = combineLatest([
    this.annotations.pipe(filter((x) => !!x)),
    this.annotationsFilterChange.pipe(filter((x) => !!x)),
  ]).pipe(
    tap((x) => console.log(x)),
    map(([a, f]) => {
      if ( f.length === 0) { return a; }
      const keys = Object.keys(a);
      keys.forEach((k) => {
        a[k] = a[k].filter((x) => x.annotation.type === 'verse');
      });
      return a;
    }),
  );

  constructor(
    private textService: TextService,
  ) {
    combineLatest([this.currentChantChange, this.manuscriptPageChange])
      .pipe(
        skip(1),
        distinctUntilChanged(),
        debounceTime(150),
        tap((x) => console.log('chant-page', x)),
        switchMap(([chant, page]) => this.textService.getVersesNumberFromPage(this.text, page, chant)),
        filter((x) => !!x),
        map((pageData) => ({ chant: pageData[0], page: this.manuscriptPage + 1 })),
      )
      .subscribe(({ chant, page }) => {
        this.currentChant = chant;
        this.currentPage = page;
      });

    this.currentPageChange
      .subscribe((page) => this.manuscriptPage = page - 1);
  }
}