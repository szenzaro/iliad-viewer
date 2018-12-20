import { Component, EventEmitter, Input, Output } from '@angular/core';

import { tagToDescription } from 'src/app/utils';
import { Verse } from 'src/app/utils/models';


@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
})
export class VerseComponent {

  tagToDescription = tagToDescription;
  @Input() verse: Verse;
  @Input() highlight = false;
  @Input() wordDetailsId: string;
  @Output() openWordId = new EventEmitter<string>();

  dataPanelIsOpen(id: string) {
    return this.verse.words.find((w) => w.id === id);
  }
}
