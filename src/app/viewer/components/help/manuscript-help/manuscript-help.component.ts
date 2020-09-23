import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manuscript-help',
  templateUrl: './manuscript-help.component.html',
  styleUrls: ['./manuscript-help.component.css']
})
export class ManuscriptHelpComponent {
  constructor(
    public activeModal: NgbActiveModal,
  ) {
  }
}
