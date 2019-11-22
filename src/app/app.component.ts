import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
    { active: false, label: 'Project Description', path: '/home' },
    { active: true, label: 'Manuscript', path: 'viewer/manuscript' },
    { active: false, label: 'Text Comparison', path: 'viewer/texts' },
    { active: false, label: 'Alignment', path: 'viewer/alignment' },
    { active: false, label: 'Search', path: 'viewer/search' },
  ];

  subscription: Subscription;

  constructor(public router: Router) {
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
}
