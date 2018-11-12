import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
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
  @Input() @InSubject() selection: number;
  @Output() selectionChange = new BehaviorSubject<number>(1);

  @Input() @InSubject() options: { id: string, label: string }[];
  optionsChange = new BehaviorSubject<{ id: string, label: string }[]>([]);

  selectedOption = this.selectionChange.pipe(map((n) => `${n}`));

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  get isFirstOption() {
    return !!this.options
      && this.options.length > 0
      && this.selectionChange.value === parseInt(this.options[0].id, 10);
  }

  get isLastOption() {
    return !!this.options
      && this.options.length > 0
      && this.selectionChange.value === parseInt(this.options[this.options.length - 1].id, 10);
  }

  private get currentValueIndex() {
    return this.options.findIndex(({id}) => id === `${this.selectionChange.value}`);
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
