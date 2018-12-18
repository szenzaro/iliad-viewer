import { Component, Input } from '@angular/core';

import { Verse } from 'src/app/utils/models';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  @Input() verses: Verse[] = [];
  @Input() highlight = false; // Highlight alternate verses

  openedWordId: string;
}
