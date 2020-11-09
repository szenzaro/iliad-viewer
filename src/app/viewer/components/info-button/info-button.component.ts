import { Component, Input } from '@angular/core';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.component.html',
  styleUrls: ['./info-button.component.css']
})
export class InfoButtonComponent {

  @Input() helpContent;

  faInfo = faInfo;

  constructor(
    private modalService: NgbModal,
  ) {
  }

  open() {
    this.modalService.open(this.helpContent, { size: 'xl', scrollable: true });
  }
}
