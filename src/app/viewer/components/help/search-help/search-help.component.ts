import { Component } from '@angular/core';
import { faBackspace, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-help',
  templateUrl: './search-help.component.html',
  styleUrls: ['./search-help.component.css']
})
export class SearchHelpComponent {

  faBackspace = faBackspace;
  faSearch = faSearch;

  constructor(
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
  ) {
  }

}
