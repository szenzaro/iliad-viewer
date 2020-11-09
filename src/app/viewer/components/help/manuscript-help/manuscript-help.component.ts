import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manuscript-help',
  templateUrl: './manuscript-help.component.html',
  styleUrls: ['./manuscript-help.component.css']
})
export class ManuscriptHelpComponent {
  constructor(
    public activeModal: NgbActiveModal,
    readonly translate: TranslateService,
  ) {
  }
}
