import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';
import { ModeSelectorComponent } from './components/mode-selector/mode-selector.component';
import { TextComparisonComponent } from './components/text-comparison/text-comparison.component';
import { ManuscriptComponent } from './components/manuscript/manuscript.component';
import { VerseComponent } from './components/verse/verse.component';
import { WordComponent } from './components/word/word.component';
import { OpenseadragonComponent } from './components/openseadragon/openseadragon.component';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    ViewerRoutingModule,
  ],
  declarations: [
    ViewerPageComponent,
    ModeSelectorComponent,
    TextComparisonComponent,
    ManuscriptComponent,
    VerseComponent,
    WordComponent,
    OpenseadragonComponent,
  ],
})
export class ViewerModule { }
