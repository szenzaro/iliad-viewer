import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-annotation-modal',
  templateUrl: './annotation-modal.component.html',
  styleUrls: ['./annotation-modal.component.scss'],
})
export class AnnotationModalComponent {

  @Input() text;

  constructor(public activeModal: NgbActiveModal) {}

}
