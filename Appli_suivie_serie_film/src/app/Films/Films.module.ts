import { HomePageModule } from '../Home/Home.module';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmsPage } from './Films.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { FilmsPageRoutingModule } from './Films-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FilmsPageRoutingModule,
    HomePageModule
  ],
  declarations: [FilmsPage]
})
export class FilmsPageModule {}
