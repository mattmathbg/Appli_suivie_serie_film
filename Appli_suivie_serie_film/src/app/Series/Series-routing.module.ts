import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeriesPage } from './Series.page';

const routes: Routes = [
  {
    path: '',
    component: SeriesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
