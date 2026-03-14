import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { SeriesPageRoutingModule } from './Series-routing.module';
import { SeriesPage } from "./Series.page";
import { SerieVueComponentModule } from "./SerieVue/SerieVue.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SeriesPageRoutingModule,
    SerieVueComponentModule
  ],
  declarations: [SeriesPage]
})
export class SeriesPageModule {}
