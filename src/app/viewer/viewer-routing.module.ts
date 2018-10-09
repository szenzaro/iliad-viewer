import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewerPageComponent } from './viewer-page/viewer-page.component';
import { ManuscriptComponent } from './components/manuscript/manuscript.component';
import { TextComparisonComponent } from './components/text-comparison/text-comparison.component';

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
