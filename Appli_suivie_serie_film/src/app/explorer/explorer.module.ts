import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExplorerPage } from './explorer.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import {ExplorerPageRoutingModule} from "./explorer-routing.module";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ExplorerPageRoutingModule
  ],
  declarations: [ExplorerPage]
})
export class ExplorerPageModule {}
