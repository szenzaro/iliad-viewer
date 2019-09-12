import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { uuid } from 'src/app/utils';
import { InSubject } from '../../utils/InSubject';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent {

  @Input() label: string;
  @Input() @InSubject() value: boolean;
  @Output() valueChange = new BehaviorSubject<boolean>(false);

  id = `switch-${uuid()}`;
}
