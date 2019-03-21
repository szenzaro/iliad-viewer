import { Component } from '@angular/core';
import { PosFilter } from 'src/app/utils';

@Component({
  selector: 'app-text-comparison',
  templateUrl: './text-comparison.component.html',
  styleUrls: ['./text-comparison.component.scss'],
})
export class TextComparisonComponent {
  filter: PosFilter;
}
