import { Component, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { InSubject } from '../../utils/InSubject';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {

  @Input() inline = false;
  @Input() label: string;
  @Input() @InSubject() selectedId: string;
  selectedIdChange = new BehaviorSubject<string>(undefined);
  @Input() @InSubject() options: { id: string, label: string }[];
  optionsChange = new BehaviorSubject<{ id: string, label: string }[]>([]);

  selected = new FormControl();


  @Output() selectionChange = this.selected.valueChanges;

  constructor(
  ) {
    this.selectedIdChange.subscribe((x) => {
      if (x !== this.selected.value) {
        this.selected.setValue(this.selectedId);
      }
    });
  }

}
