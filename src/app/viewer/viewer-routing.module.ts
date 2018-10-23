import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManuscriptComponent } from './components/manuscript/manuscript.component';
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
