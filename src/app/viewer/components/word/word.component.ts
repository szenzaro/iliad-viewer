import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Word, WordData } from 'src/app/utils/models';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {

  @Input() highlighted = false;
  @Input() word: Word;
  @Output() openWordId = new EventEmitter<string>();
}
