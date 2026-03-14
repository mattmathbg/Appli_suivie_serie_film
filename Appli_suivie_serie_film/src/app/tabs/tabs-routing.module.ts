import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'Films',
        loadChildren: () => import('../Films/Films.module').then(m => m.FilmsPageModule)
      },
      {
        path: 'explorer',
        loadChildren: () => import('../explorer/explorer.module').then(m => m.ExplorerPageModule)
      },
      {
        path: 'Home',
        loadChildren: () => import('../Home/Home.module').then(m => m.HomePageModule)
      },
      {
        path: 'Series',
        loadChildren: () => import('../Series/Series.module').then(m => m.SeriesPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/explorer',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/Films',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
