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
        children: [
          { path: '', loadChildren: () => import('../Films/Films.module').then(m => m.FilmsPageModule) },
          { path: 'details/:id', loadChildren: () => import('../details/details.module').then(m => m.DetailsPageModule) }
        ]
      },
      {
        path: 'explorer',
        children: [
          { path: '', loadChildren: () => import('../explorer/explorer.module').then(m => m.ExplorerPageModule) },
          { path: 'details/:id', loadChildren: () => import('../details/details.module').then(m => m.DetailsPageModule) }
        ]
      },
      {
        path: 'Home',
        children: [
          { path: '', loadChildren: () => import('../Home/Home.module').then(m => m.HomePageModule) },
          { path: 'details/:id', loadChildren: () => import('../details/details.module').then(m => m.DetailsPageModule) }
        ]
      },
      {
        path: 'Series',
        children: [
          { path: '', loadChildren: () => import('../Series/Series.module').then(m => m.SeriesPageModule) },
          { path: 'details/:id', loadChildren: () => import('../details/details.module').then(m => m.DetailsPageModule) }
        ]
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
