import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UiSwitchModule } from 'ngx-ui-switch';

import { AlignedTextsComponent } from './components/aligned-texts/aligned-texts.component';
import { AnnotationFilterComponent } from './components/annotation-filter/annotation-filter.component';
import { AnnotationModalComponent } from './components/annotation-modal/annotation-modal.component';
import { ComparableTextComponent } from './components/comparable-text/comparable-text.component';
import { InterlinearTextComponent } from './components/interlinear-text/interlinear-text.component';
import { ManuscriptComponent } from './components/manuscript/manuscript.component';
import { OpenseadragonComponent } from './components/openseadragon/openseadragon.component';
import { PillComponent } from './components/pill/pill.component';
import { RadioComponent } from './components/radio/radio.component';
import { SearchAlignmentResultComponent } from './components/search-alignment-result/search-alignment-result.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchComponent } from './components/search/search.component';
import { SelectNumberComponent } from './components/select-number/select-number.component';
import { SelectTextComponent } from './components/select-text/select-text.component';
import { SelectComponent } from './components/select/select.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SwitchComponent } from './components/switch/switch.component';
import { TextComparisonComponent } from './components/text-comparison/text-comparison.component';
import { TextComponent } from './components/text/text.component';
import { VerseComponent } from './components/verse/verse.component';
import { WordFiltersComponent } from './components/word-filters/word-filters.component';
import { WordComponent } from './components/word/word.component';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';

import { ViewerRoutingModule } from './viewer-routing.module';

import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../app.module';
import { ManuscriptService } from './services/manuscript.service';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    ScrollingModule,
    UiSwitchModule,
    ViewerRoutingModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    AlignedTextsComponent,
    AnnotationFilterComponent,
    AnnotationModalComponent,
    ComparableTextComponent,
    InterlinearTextComponent,
    ManuscriptComponent,
    OpenseadragonComponent,
    PillComponent,
    RadioComponent,
    SearchAlignmentResultComponent,
    SearchBoxComponent,
    SearchComponent,
    SearchResultComponent,
    SelectComponent,
    SelectNumberComponent,
    SelectTextComponent,
    SpinnerComponent,
    SwitchComponent,
    TextComparisonComponent,
    TextComponent,
    VerseComponent,
    ViewerPageComponent,
    WordComponent,
    WordFiltersComponent,
  ],
  providers: [
    ManuscriptService,
  ],
  entryComponents: [
    AnnotationModalComponent,
  ],
})
export class ViewerModule {
}
