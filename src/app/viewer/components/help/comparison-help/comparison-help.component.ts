import { Component } from '@angular/core';
import {faBackspace } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-comparison-help',
  templateUrl: './comparison-help.component.html',
  styleUrls: ['./comparison-help.component.css']
})
export class ComparisonHelpComponent {

  faBackspace = faBackspace;
  constructor(
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
  ) {
  }
}
