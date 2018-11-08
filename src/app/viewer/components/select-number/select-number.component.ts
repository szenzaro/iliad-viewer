import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { InSubject } from '../../utils/InSubject';

import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function numberToOptions(n: number) {
  return new Array(n).fill(undefined).map((_, i) => ({ id: `${i + 1}`, label: `${i + 1}` }));
}

@Component({
  selector: 'app-select-number',
  templateUrl: './select-number.component.html',
  styleUrls: ['./select-number.component.scss']
})
export class SelectNumberComponent {

  @Input() inline = true;
  @Input() label: string;
  @Input() @InSubject() number: number;
  numberChange = new BehaviorSubject<number>(1);
  @Output() selectionChange = new BehaviorSubject<number>(1);

  options = this.numberChange
    .pipe(
      map((n) => numberToOptions(n)),
    );

  selectedOption = this.selectionChange.pipe(map((n) => `${n}`));

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  toInt(x: string) {
    return parseInt(x, 10);
  }
}
