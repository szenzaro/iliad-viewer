import { Component } from '@angular/core';
import {faBackspace } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alignment-help',
  templateUrl: './alignment-help.component.html',
  styleUrls: ['./alignment-help.component.css']
})
export class AlignmentHelpComponent {
  faBackspace = faBackspace;

  constructor(
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
  ) {
  }
}
