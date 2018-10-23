import { Component } from '@angular/core';
import { TextService } from 'src/app/services/text.service';
import { Verse } from 'src/app/utils/models';

import { NEVER, Observable } from 'rxjs';

@Component({
  selector: 'app-text-comparison',
  templateUrl: './text-comparison.component.html',
  styleUrls: ['./text-comparison.component.scss'],
})
export class TextComparisonComponent {

  data: Observable<Verse[]> = NEVER;

  constructor(private readonly textService: TextService) {
    this.data = this.textService.getVerses('text1', 1);
  }

}
