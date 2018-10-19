import { Component } from '@angular/core';
import { Observable, NEVER } from 'rxjs';
import { TextService } from 'src/app/services/text.service';
import { Verse } from 'src/app/utils/models';

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
