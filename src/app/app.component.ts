import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface OptionItem {
  label: string;
  path: string;
  active: boolean;
}

declare let gtag: (evtName: string, id: string, data) => void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'iliad-viewer';

  defaultOptions: OptionItem[] = [
    { active: false, label: _T('Project Description'), path: '/home' },
    { active: true, label: _T('Manuscript'), path: 'viewer/manuscript' },
    { active: false, label: _T('Text Comparison'), path: 'viewer/texts' },
    { active: false, label: _T('Alignment'), path: 'viewer/alignment' },
    { active: false, label: _T('Scholie'), path: 'viewer/scholie' },
    { active: false, label: _T('Search'), path: 'viewer/search' },
    { active: false, label: _T('Annexes'), path: 'viewer/annexes' },
  ];

  faLanguage = faLanguage;
  languages = [
    {
      id: 'en',
      label: _T('English'),
    },
    {
      id: 'fr',
      label: _T('French'),
    },
  ];

  subscription: Subscription;

  constructor(
    public router: Router,
    readonly translate: TranslateService,
  ) {
    const bl = this.translate.getBrowserLang();
    translate.use(this.languages.find((v) => v.id === bl)?.id || 'fr');
    // translate.use('fr');
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag(
          'config',
          'UA-153161869-1',
          {
            page_path: event.urlAfterRedirects
          }
        );
      }
    }
    );
  }

  ngOnDestroy(): void {
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  chooseLang(lang: 'en' | 'fr') {
    this.translate.use(lang);
  }
}
