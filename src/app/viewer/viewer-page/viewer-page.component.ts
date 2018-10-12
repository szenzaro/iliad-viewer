import { Component, OnInit } from '@angular/core';
import { TextService } from 'src/app/services/text.service';
import { Observable, NEVER } from 'rxjs';

@Component({
  selector: 'app-viewer-page',
  templateUrl: './viewer-page.component.html',
  styleUrls: ['./viewer-page.component.scss'],
})
export class ViewerPageComponent {

  data: Observable<Object> = NEVER;

  constructor(private readonly textService: TextService) {
    this.data = this.textService.getVerses('text1', 1);
  }

}
