import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comparison-help',
  templateUrl: './comparison-help.component.html',
  styleUrls: ['./comparison-help.component.css']
})
export class ComparisonHelpComponent {

  constructor(
    public activeModal: NgbActiveModal,
  ) {
  }
}
