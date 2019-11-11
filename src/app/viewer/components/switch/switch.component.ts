import { Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { uuid } from 'src/app/utils';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent {

  @Input() label: string;
  private _v: boolean;
  @Input() set value(v: boolean) {
    if (v !== this._v) {
      this._v = v;
      this.valueChange.next(v);
    }
  }
  get value() { return this._v; }
  @Output() valueChange = new Subject<boolean>();

  id = `switch-${uuid()}`;
}
