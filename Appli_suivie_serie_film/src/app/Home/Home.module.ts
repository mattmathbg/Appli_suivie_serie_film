import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './Home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import {HomePageRoutingModule} from "./Home-routing.module";
import {SliderSeriesFilmsComponent} from "../components/slider-series-films/slider-series-films.component";
import {StatsComponent} from "../components/stats/stats.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HomePageRoutingModule,
    SliderSeriesFilmsComponent,
    StatsComponent
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
