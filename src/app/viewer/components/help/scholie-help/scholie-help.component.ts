import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scholie-help',
  templateUrl: './scholie-help.component.html',
  styleUrls: ['./scholie-help.component.css']
})
export class ScholieHelpComponent {

  constructor(
    public activeModal: NgbActiveModal,
  ) {
  }

}
