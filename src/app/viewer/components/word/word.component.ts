import { Component, Input } from '@angular/core';
import { Word } from 'src/app/utils/models';

@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {

  @Input() word: Word;

}
