import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmsPage } from './Films.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FilmsPageRoutingModule } from './Films-routing.module';
import {StatsComponent} from "../components/stats/stats.component";
import {SliderSeriesFilmsComponent} from "../components/slider-series-films/slider-series-films.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FilmsPageRoutingModule,
    StatsComponent,
    SliderSeriesFilmsComponent
  ],
  declarations: [FilmsPage]
})
export class FilmsPageModule {}
