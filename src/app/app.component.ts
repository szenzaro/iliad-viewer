import { Component } from '@angular/core';


interface OptionItem {
  label: string;
  path: string;
  active: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'iliad-viewer';

  defaultOptions: OptionItem[] = [
    { active: false, label: 'Project Description', path: '/home' },
    { active: true, label: 'Manuscript', path: 'viewer/manuscript' },
    { active: false, label: 'Text Comparison', path: 'viewer/texts' },
    { active: false, label: 'Alignment', path: 'viewer/alignment' },
    { active: false, label: 'Search', path: 'viewer/search' },
    { active: false, label: 'About', path: '/about' },
  ];
}
