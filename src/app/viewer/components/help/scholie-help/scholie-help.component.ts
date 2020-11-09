import { Component } from '@angular/core';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-scholie-help',
  templateUrl: './scholie-help.component.html',
  styleUrls: ['./scholie-help.component.css']
})
export class ScholieHelpComponent {

  faBackspace = faBackspace;

  constructor(
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
  ) {
  }

}
