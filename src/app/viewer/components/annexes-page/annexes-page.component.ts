import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-annexes-page',
  templateUrl: './annexes-page.component.html',
  styleUrls: ['./annexes-page.component.scss']
})
export class AnnexesPageComponent {

  constructor(
    readonly translate: TranslateService,
  ) {
  }
}
