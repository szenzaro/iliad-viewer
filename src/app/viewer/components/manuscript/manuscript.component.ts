import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-manuscript',
  templateUrl: './manuscript.component.html',
  styleUrls: ['./manuscript.component.scss'],
})
export class ManuscriptComponent {

  @Input() currentPage = 1;
  @Input() currentChant = 1;

}
