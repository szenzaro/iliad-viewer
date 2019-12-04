import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { InSubject } from '../../utils/in-subject';

import { TextService } from 'src/app/services/text.service';

import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { Annotation, RecursivePartial, satisfies } from 'src/app/utils/models';
import { ManuscriptService } from '../../services/manuscript.service';

@Component({
  selector: 'app-manuscript',
  templateUrl: './manuscript.component.html',
  styleUrls: ['./manuscript.component.scss'],
})
export class ManuscriptComponent implements AfterViewInit, OnDestroy {

  @Input() @InSubject() currentPage: number;
  currentPageChange = new BehaviorSubject<number>(110);
  @Input() @InSubject() currentChant: number;
  currentChantChange = new BehaviorSubject<number>(3);

  @InSubject() manuscriptPage: number;
  manuscriptPageChange = new BehaviorSubject<number>(109);

  text = 'homeric';

  annotations = this.textService.getAnnotations();
  @Input() @InSubject() annotationsFilter: Array<RecursivePartial<Annotation>>;
  annotationsFilterChange = new BehaviorSubject<Array<RecursivePartial<Annotation>>>([]);

  @Input() @InSubject() showAnnotations: boolean;
  showAnnotationsChange = new BehaviorSubject<boolean>(false);

  filteredAnnotations = combineLatest([
    this.annotations.pipe(filter((x) => !!x)),
    this.annotationsFilterChange.pipe(filter((x) => !!x)),
    this.showAnnotationsChange,
  ]).pipe(
    map(([a, fs, show]) => {
      if (!show) { return {}; }
      if (fs.length === 0) { return { ...a }; }
      const toRet = {};
      const keys = Object.keys(a);
      keys.forEach((k) => {
        toRet[k] = a[k].filter((x) => fs.some((f) => satisfies(x.annotation, f)));
      });
      return toRet;
    }),
  );

  unsubscribe = new Subject();

  constructor(
    private textService: TextService,
    readonly manuscriptService: ManuscriptService,
    readonly activeRoute: ActivatedRoute,
    readonly router: Router,
  ) {
    combineLatest([
      this.manuscriptService.chant,
      this.manuscriptService.page,
      this.manuscriptService.verse,
      this.showAnnotationsChange,
      this.annotationsFilterChange,
    ]).pipe(
      takeUntil(this.unsubscribe),
      debounceTime(250),
    ).subscribe(([chant, page, verse, annotation, annfilter]) => {
      const queryParams = {
        chant,
        page,
        verse,
        sa: annotation ? annotation : undefined,
        af: annfilter.map((x) => x.type === 'verse' ? `verse-${x.data.type}` : x.type).join(','),
      };
      this.router.navigate([this.router.url.split('?')[0]], { queryParams });
    });
  }

  ngAfterViewInit(): void {
    this.activeRoute.queryParams
      .pipe(
        takeUntil(this.unsubscribe),
        debounceTime(150),
      )
      .subscribe((params) => {
        if (!!params.chant) {
          this.manuscriptService.chantInput.next(+params.chant);
        }
        if (!!params.page) {
          this.manuscriptService.pageInput.next(+params.page);
        }
        if (!!params.verse) {
          this.manuscriptService.verseInput.next(+params.verse);
        }
        if (!!params.sa) {
          this.showAnnotations = true;
        }
        if (!!params.af) {
          const filters: string[] = params.af.split(',');
          const verseFilters = filters.filter((x) => x.startsWith('verse-'));
          const otherFilters = filters.filter((x) => !x.startsWith('verse-'));

          const annFilter: Array<RecursivePartial<Annotation>> = otherFilters
            .map((f) => ({ type: f } as RecursivePartial<Annotation>))
            .concat(verseFilters.map((f) => ({ type: 'verse', data: { type: f.split('-')[1] } } as RecursivePartial<Annotation>)));

          this.annotationsFilter = annFilter;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
