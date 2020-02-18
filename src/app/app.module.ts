import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AboutPageComponent } from './about-page/about-page.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ViewerModule } from './viewer/viewer.module';

import { TextService } from './services/text.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AboutPageComponent,
    AppComponent,
    HomePageComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    NgbModule,
    NgSelectModule,
    ViewerModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    AppRoutingModule,
  ],
  providers: [
    TextService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
