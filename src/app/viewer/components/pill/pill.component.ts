import { Component, Input, Output } from '@angular/core';
import { InSubject } from '../../utils/InSubject';

import { faMars, faNeuter, faVenus } from '@fortawesome/free-solid-svg-icons';

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
  @Input() gender: 'M' | 'F' | 'N';

  faNeuter = faNeuter;
  faMars = faMars;
  faVenus = faVenus;

  _kind: string;
  get kind() { return this._kind; }
  @Input() set kind(s: string) {
    this._kind = s;
    this.classes = this.defaultClasses.concat(s);
  }

  private defaultClasses = ['badge'];
  classes = this.defaultClasses;
}
