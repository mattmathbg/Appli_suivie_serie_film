import {Component, inject} from '@angular/core';
import {DataService} from "../Services/data.service";
import {DataSerieModel} from "../models/data-serie.model";

@Component({
  selector: 'app-home',
  templateUrl: 'Home.page.html',
  styleUrls: ['Home.page.scss'],
  standalone: false,
})
export class HomePage {

  private data = inject(DataService);
  constructor() {}

  getSerie(): DataSerieModel[] {
    return this.data.getDataSeries();
  }
}
