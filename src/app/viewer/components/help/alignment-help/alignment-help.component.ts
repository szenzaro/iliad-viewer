import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alignment-help',
  templateUrl: './alignment-help.component.html',
  styleUrls: ['./alignment-help.component.css']
})
export class AlignmentHelpComponent {
  constructor(
    public activeModal: NgbActiveModal,
  ) {
  }
}
