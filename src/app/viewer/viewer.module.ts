import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';
import { ModeSelectorComponent } from './components/mode-selector/mode-selector.component';
import { TextComparisonComponent } from './components/text-comparison/text-comparison.component';
import { ManuscriptComponent } from './components/manuscript/manuscript.component';
import { VerseComponent } from './components/verse/verse.component';
import { WordComponent } from './components/word/word.component';

@NgModule({
  imports: [
    CommonModule,
    ViewerRoutingModule,
  ],
  declarations: [
    ViewerPageComponent,
    ModeSelectorComponent,
    TextComparisonComponent,
    ManuscriptComponent,
    VerseComponent,
    WordComponent,
  ],
})
export class ViewerModule { }
