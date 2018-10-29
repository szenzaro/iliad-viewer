import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {

  @Input() label: string;
  @Input() set options(opts: { id: string, label: string }[]) {
    this.optionsChange.next(opts);
  }
  get options() { return this.optionsChange.value; }
  optionsChange = new BehaviorSubject<{ id: string, label: string }[]>([]);

  selected = new FormControl();

  @Output() selectionChange = this.selected.valueChanges;

}
