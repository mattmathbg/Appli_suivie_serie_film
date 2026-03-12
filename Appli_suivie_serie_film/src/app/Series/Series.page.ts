import {Component, inject} from '@angular/core';
import {DataService} from "../Services/data.service";
import {DataSerieModel} from "../models/data-serie.model";

@Component({
  selector: 'app-series-page',
  templateUrl: 'Series.page.html',
  styleUrls: ['Series.page.scss'],
  standalone: false,
})
export class SeriesPage {
  private data = inject(DataService);
  constructor() {}

  getSerie(): DataSerieModel[] {
    return this.data.getDataSeries();
  }

}
