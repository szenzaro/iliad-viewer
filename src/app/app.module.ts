import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';

import { AboutPageComponent } from './about-page/about-page.component';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ViewerModule } from './viewer/viewer.module';

import { TextService } from './services/text.service';

@NgModule({
  declarations: [
    AboutPageComponent,
    AppComponent,
    HomePageComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ViewerModule,

    AppRoutingModule,
  ],
  providers: [
    TextService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
