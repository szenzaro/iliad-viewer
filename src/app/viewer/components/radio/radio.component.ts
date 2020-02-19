import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject, merge } from 'rxjs';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { uuid } from 'src/app/utils';
import { InSubject } from '../../utils/in-subject';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent {

  id = `radio-${uuid()}`;

  @Input() label: string;
  @Input() items: Array<{ id: string, label: string }> = [];
  @Input() inline = false;
  @Input() @InSubject() initialValue: string;
  initialValueChange = new BehaviorSubject<string>(undefined);

  @InSubject() choice: string;
  choiceChange = new BehaviorSubject<string>(undefined);

  @Output() value = merge(
    this.initialValueChange.pipe(tap((x) => this.choiceChange.next(x))),
    this.choiceChange
  ).pipe(
    distinctUntilChanged(),
    filter((x) => !!x),
  );
}
