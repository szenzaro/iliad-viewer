import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ViewerPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'viewer', component: ViewerPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: '**', component: PageNotFoundComponent },
];

import { AppComponent } from './app.component';
import { ViewerPageComponent } from './components/pages/viewer-page/viewer-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewerPageComponent,
    HomePageComponent,
    AboutPageComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  exports: [RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
