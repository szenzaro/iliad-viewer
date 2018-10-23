import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, map, startWith } from 'rxjs/operators';

type Mode = 'Manuscript' | 'Text Comparison';

interface OptionItem {
  label: Mode;
  active: boolean;
  path: string;
}

@Component({
  selector: 'app-mode-selector',
  templateUrl: './mode-selector.component.html',
  styleUrls: ['./mode-selector.component.scss'],
})
export class ModeSelectorComponent {

  private defaultOptions: OptionItem[] = [
    { label: 'Manuscript', active: false, path: 'manuscript' },
    { label: 'Text Comparison', active: false, path: 'texts' },
  ];

  private navigationEnd = this.router.events.pipe(
    filter((x: NavigationEnd) => !!x.urlAfterRedirects),
    map((x) => x.urlAfterRedirects),
    startWith(this.router.url),
  );

  options = this.navigationEnd
    .pipe(
      map((url) => this.defaultOptions
        .map(({ label, path }) => ({ label, active: url.endsWith(`/${path}`), path } as OptionItem))
      ),
    );

  constructor(
    private router: Router,
  ) {
  }

}
