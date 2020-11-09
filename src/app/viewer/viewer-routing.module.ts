import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AlignedTextsComponent } from './components/aligned-texts/aligned-texts.component';
import { AnnexesPageComponent } from './components/annexes-page/annexes-page.component';
import { ManuscriptComponent } from './components/manuscript/manuscript.component';
import { ScholieComponent } from './components/scholie/scholie.component';
import { SearchComponent } from './components/search/search.component';
import { TextComparisonComponent } from './components/text-comparison/text-comparison.component';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';

const routes: Routes = [
  {
    path: 'viewer', component: ViewerPageComponent,
    children: [
      {
        path: 'manuscript',
        component: ManuscriptComponent,
      },
      {
        path: 'texts',
        component: TextComparisonComponent,
      },
      {
        path: 'alignment',
        component: AlignedTextsComponent,
      },
      {
        path: 'scholie',
        component: ScholieComponent,
      },
      {
        path: 'search',
        component: SearchComponent,
      },
      {
        path: 'annexes',
        component: AnnexesPageComponent,
      },
      {
        path: '',
        redirectTo: 'manuscript',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewerRoutingModule { }
