import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmsPage } from './Films.page';

const routes: Routes = [
  {
    path: '',
    component: FilmsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsPageRoutingModule {}
