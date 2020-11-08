import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { defaultOptions } from './utils';

declare let gtag: (evtName: string, id: string, data) => void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'iliad-viewer';

  defaultOptions = defaultOptions;

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
    readonly route: Router,
  ) {
    // const bl = this.translate.getBrowserLang();
    // translate.use(this.languages.find((v) => v.id === bl)?.id || 'fr'); // TODO: activate when the english translation will be available
    translate.use('fr');
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
