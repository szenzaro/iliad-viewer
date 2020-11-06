import { Component, Input, Output } from '@angular/core';
import { TextService } from 'src/app/services/text.service';

import { InSubject } from '../../utils/in-subject';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { marker as _T } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-text',
  templateUrl: './select-text.component.html',
  styleUrls: ['./select-text.component.scss'],
})
export class SelectTextComponent {

  @Input() inline = true;
  @Input() label: string;
  @Input() disabled = false;
  @Input() bindValue: string;

  textsList = this.textService.textList.pipe(
    map((tl) => tl.map((t) => ({ ...t, label: this.ts.instant(_T(t.label))}))),
  );

  @Input() @InSubject() text: string;
  @Output() textChange = new BehaviorSubject<string>(undefined);

  constructor(
    private textService: TextService,
    private ts: TranslateService
  ) {
  }
}
