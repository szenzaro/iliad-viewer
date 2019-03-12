import { Component, Input, Output } from '@angular/core';
import { InSubject } from '../../utils/InSubject';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-pill',
  templateUrl: './pill.component.html',
  styleUrls: ['./pill.component.scss'],
})
export class PillComponent {
  @Input() @InSubject() selected;
  @Output() selectedChange = new BehaviorSubject<boolean>(false);

  @Input() label: string;

  _kind: string;
  get kind() { return this._kind; }
  @Input() set kind(s: string) {
    this._kind = s;
    this.classes = this.defaultClasses.concat(s);
  }

  private defaultClasses = ['badge'];
  classes = this.defaultClasses;
}
