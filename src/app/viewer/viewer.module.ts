import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';
import { ModeSelectorComponent } from './components/mode-selector/mode-selector.component';
import { ManuscriptComponent } from './components/manuscript/manuscript.component';

@NgModule({
  imports: [
    CommonModule,
    ViewerRoutingModule,
  ],
  declarations: [
    ViewerPageComponent,
    ModeSelectorComponent,
    ManuscriptComponent,
  ],
})
export class ViewerModule { }
