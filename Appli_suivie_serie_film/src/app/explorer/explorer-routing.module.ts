import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExplorerPage } from './explorer.page';

const routes: Routes = [
  {
    path: '',
    component: ExplorerPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExplorerPageRoutingModule {}
