import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExplorerPage } from './explorer.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { ExplorerPageRoutingModule } from "./explorer-routing.module";
import { SearchComponent } from '../components/search/search.component';
import {HomePageModule} from "../Home/Home.module";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ExplorerPageRoutingModule,
    HomePageModule,
  ],
  declarations: [ExplorerPage, SearchComponent]
})
export class ExplorerPageModule {}
