import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';
import { OpenseadragonComponent } from './components/openseadragon/openseadragon.component';

@NgModule({
  imports: [
    CommonModule,
    ViewerRoutingModule,
  ],
  declarations: [
    ViewerPageComponent,
    OpenseadragonComponent,
  ],
})
export class ViewerModule { }
