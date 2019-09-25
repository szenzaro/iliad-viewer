import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, map, skip } from 'rxjs/operators';
import { InSubject } from '../../utils/InSubject';

import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-select-number',
  templateUrl: './select-number.component.html',
  styleUrls: ['./select-number.component.scss']
})
export class SelectNumberComponent {

  @Input() inline = true;
  @Input() label: string;
  _selection: number;
  @Input() set selection(n: number) {
    if (n !== NaN && n !== null && n !== this._selection) {
      this._selection = n;
      this.selectionChange.next(n);
    }
  }
  get selection() { return this._selection; }
  @Output() selectionChange = new Subject<number>();

  @Input() @InSubject() options: { id: string, label: string }[];
  optionsChange = new BehaviorSubject<{ id: string, label: string }[]>([]);

  selectedOption = this.selectionChange.pipe(
    debounceTime(150),
    map((n) => `${n}`),
    skip(1),
  );

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  get isFirstOption() {
    return !!this.options
      && this.options.length > 0
      && this.selection === parseInt(this.options[0].id, 10);
  }

  get isLastOption() {
    return !!this.options
      && this.options.length > 0
      && this.selection === parseInt(this.options[this.options.length - 1].id, 10);
  }

  private get currentValueIndex() {
    return this.options.findIndex(({ id }) => id === `${this.selection}`);
  }

  get nextNumber() {
    return parseInt(this.options[this.currentValueIndex + 1].id, 10);
  }

  get prevNumber() {
    return parseInt(this.options[this.currentValueIndex - 1].id, 10);
  }


  toInt(x: string) {
    return parseInt(x, 10);
  }
}
