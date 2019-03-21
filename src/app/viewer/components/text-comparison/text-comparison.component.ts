import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-comparison',
  templateUrl: './text-comparison.component.html',
  styleUrls: ['./text-comparison.component.scss'],
})
export class TextComparisonComponent {
  @Input() scrollIndex = 0;
}
