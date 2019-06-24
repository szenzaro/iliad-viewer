import { Component, Input } from '@angular/core';
import { InSubject } from '../../utils/InSubject';

import { TextService } from 'src/app/services/text.service';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, skip, switchMap, tap } from 'rxjs/operators';
import { Annotation, RecursivePartial, satisfies } from 'src/app/utils/models';
import { ManuscriptService } from '../../services/manuscript.service';

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

  constructor(
    private textService: TextService,
    readonly manuscriptService: ManuscriptService,
  ) {
  }
}
