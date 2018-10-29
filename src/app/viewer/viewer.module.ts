import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { InterlinearTextComponent } from './components/interlinear-text/interlinear-text.component';
import { ManuscriptComponent } from './components/manuscript/manuscript.component';
import { ModeSelectorComponent } from './components/mode-selector/mode-selector.component';
import { OpenseadragonComponent } from './components/openseadragon/openseadragon.component';
import { SelectTextComponent } from './components/select-text/select-text.component';
import { SelectComponent } from './components/select/select.component';
import { TextComparisonComponent } from './components/text-comparison/text-comparison.component';
import { VerseComponent } from './components/verse/verse.component';
import { WordComponent } from './components/word/word.component';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';
import { ViewerRoutingModule } from './viewer-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ViewerRoutingModule,
  ],
  declarations: [
    InterlinearTextComponent,
    ManuscriptComponent,
    ModeSelectorComponent,
    OpenseadragonComponent,
    TextComparisonComponent,
    VerseComponent,
    ViewerPageComponent,
    WordComponent,
    SelectTextComponent,
    SelectComponent,
  ],
})
export class ViewerModule { }
