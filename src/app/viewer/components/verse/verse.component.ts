import { Component, Input } from '@angular/core';
import { Verse } from 'src/app/utils/models';

@Component({
  selector: 'app-verse',
  templateUrl: './verse.component.html',
  styleUrls: ['./verse.component.scss'],
})
export class VerseComponent {

  @Input() verse: Verse;
  @Input() highlight = false;

}

