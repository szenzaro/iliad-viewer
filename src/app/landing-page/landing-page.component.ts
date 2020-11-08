import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { defaultOptions } from '../utils';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {

  defaultOptions = defaultOptions;

  constructor(
    readonly translate: TranslateService,
  ) {
  }
}
