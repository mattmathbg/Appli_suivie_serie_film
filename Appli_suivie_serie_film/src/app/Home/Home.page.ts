import {Component, inject} from '@angular/core';
import {DataService} from "../Services/data.service";
import {DataSerieModel} from "../models/data-serie.model";
import {DataFilmModel} from "../models/data-film.models";

@Component({
  selector: 'app-home',
  templateUrl: 'Home.page.html',
  styleUrls: ['Home.page.scss'],
  standalone: false,
})
export class HomePage {

  private data = inject(DataService);
  constructor() {}

  getSerie(): (DataSerieModel | DataFilmModel)[] {
    return this.data.getDataSeries();
  }
}
