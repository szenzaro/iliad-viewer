import { Component, Input } from '@angular/core';
import { InSubject } from '../../utils/InSubject';

import { TextService } from 'src/app/services/text.service';

import { BehaviorSubject } from 'rxjs';
import { combineLatest, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-manuscript',
  templateUrl: './manuscript.component.html',
  styleUrls: ['./manuscript.component.scss'],
})
export class ManuscriptComponent {

  @Input() @InSubject() currentPage: number;
  currentPageChange = new BehaviorSubject<number>(1);
  @Input() @InSubject() currentChant: number;
  currentChantChange = new BehaviorSubject<number>(1);

  @InSubject() manuscriptPage: number;
  manuscriptPageChange = new BehaviorSubject<number>(0);

  text = 'homeric';

  constructor(
    private textService: TextService,
  ) {
    this.manuscriptPageChange
      .pipe(
        distinctUntilChanged(),
        switchMap((page) => this.textService.getVersesNumberFromPage(this.text, page)),
        map((pageData) => ({ chant: pageData[0], page: this.manuscriptPage + 1 })),
      )
      .subscribe(({ chant, page }) => {
        this.currentChant = chant;
        this.currentPage = page;
      });

    this.currentPageChange
      .subscribe((page) => this.manuscriptPage = page - 1 );
  }
}
