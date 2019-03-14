import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AnnotationModalComponent } from './components/annotation-modal/annotation-modal.component';
import { ComparableTextComponent } from './components/comparable-text/comparable-text.component';
import { InterlinearTextComponent } from './components/interlinear-text/interlinear-text.component';
import { ManuscriptComponent } from './components/manuscript/manuscript.component';
import { ModeSelectorComponent } from './components/mode-selector/mode-selector.component';
import { OpenseadragonComponent } from './components/openseadragon/openseadragon.component';
import { PillComponent } from './components/pill/pill.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchComponent } from './components/search/search.component';
import { SelectNumberComponent } from './components/select-number/select-number.component';
import { SelectTextComponent } from './components/select-text/select-text.component';
import { SelectComponent } from './components/select/select.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { TextComparisonComponent } from './components/text-comparison/text-comparison.component';
import { TextComponent } from './components/text/text.component';
import { VerseComponent } from './components/verse/verse.component';
import { WordFiltersComponent } from './components/word-filters/word-filters.component';
import { WordComponent } from './components/word/word.component';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';
import { ViewerRoutingModule } from './viewer-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbModule,
    ReactiveFormsModule,
    ScrollingModule,
    ViewerRoutingModule,
  ],
  declarations: [
    AnnotationModalComponent,
    ComparableTextComponent,
    InterlinearTextComponent,
    ManuscriptComponent,
    ModeSelectorComponent,
    OpenseadragonComponent,
    PillComponent,
    SearchComponent,
    SearchResultComponent,
    SelectComponent,
    SelectNumberComponent,
    SelectTextComponent,
    SpinnerComponent,
    TextComparisonComponent,
    TextComponent,
    VerseComponent,
    ViewerPageComponent,
    WordComponent,
    WordFiltersComponent,
  ],
  entryComponents: [
    AnnotationModalComponent,
  ],
})
export class ViewerModule { }
