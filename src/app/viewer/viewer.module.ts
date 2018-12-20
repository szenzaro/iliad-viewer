import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AnnotationModalComponent } from './components/annotation-modal/annotation-modal.component';
import { InterlinearTextComponent } from './components/interlinear-text/interlinear-text.component';
import { ManuscriptComponent } from './components/manuscript/manuscript.component';
import { ModeSelectorComponent } from './components/mode-selector/mode-selector.component';
import { OpenseadragonComponent } from './components/openseadragon/openseadragon.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchComponent } from './components/search/search.component';
import { SelectNumberComponent } from './components/select-number/select-number.component';
import { SelectTextComponent } from './components/select-text/select-text.component';
import { SelectComponent } from './components/select/select.component';
import { TextComparisonComponent } from './components/text-comparison/text-comparison.component';
import { VerseComponent } from './components/verse/verse.component';
import { WordComponent } from './components/word/word.component';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';
import { ViewerRoutingModule } from './viewer-routing.module';
import { TextComponent } from './components/text/text.component';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ViewerRoutingModule,
  ],
  declarations: [
    AnnotationModalComponent,
    InterlinearTextComponent,
    ManuscriptComponent,
    ModeSelectorComponent,
    OpenseadragonComponent,
    SearchComponent,
    SearchResultComponent,
    SelectComponent,
    SelectNumberComponent,
    SelectTextComponent,
    TextComparisonComponent,
    VerseComponent,
    ViewerPageComponent,
    WordComponent,
    TextComponent,
  ],
  entryComponents: [
    AnnotationModalComponent,
  ],
})
export class ViewerModule { }
