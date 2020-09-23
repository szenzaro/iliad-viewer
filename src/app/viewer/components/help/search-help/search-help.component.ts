import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-help',
  templateUrl: './search-help.component.html',
  styleUrls: ['./search-help.component.css']
})
export class SearchHelpComponent {

  constructor(
    public activeModal: NgbActiveModal,
  ) {
  }

}
