import { Component, EventEmitter, Output } from '@angular/core';
import { TextService } from 'src/app/services/text.service';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-select-text',
  templateUrl: './select-text.component.html',
  styleUrls: ['./select-text.component.scss'],
})
export class SelectTextComponent {

  textsList = this.textService.getTextsList()
    .pipe(
      map(({textsList}) => textsList),
    );

  @Output() textChange = new EventEmitter<string>();

  constructor(private textService: TextService) {
  }
}
