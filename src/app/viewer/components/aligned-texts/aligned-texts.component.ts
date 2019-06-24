import { Component, EventEmitter } from '@angular/core';
import { TextService } from 'src/app/services/text.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-aligned-texts',
  templateUrl: './aligned-texts.component.html',
  styleUrls: ['./aligned-texts.component.scss']
})
export class AlignedTextsComponent {
  readonly wordOver = new EventEmitter<string>();

  al1 = this.wordOver.pipe(
    switchMap((x) => this.textService.getAlignment('homeric', 'paraphrase', x)),
  );

  constructor(
    readonly textService: TextService,
  ) {
  }
}
