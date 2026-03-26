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
  public dataSeries: DataSerieModel[] = [];
  public seriesEnCours: DataSerieModel[] = [];
  public toutesMesSeries: DataSerieModel[] = [];
  constructor() {}

  async ngOnInit() {
    const listFilm = await this.data.getContenues();

    if (listFilm ) {
      this.dataSeries = listFilm
        .filter(item => item.type === 'series')
        .map(item => new DataSerieModel(item));
    }
  }

  async ionViewWillEnter() {
    const uniquementSeries = await this.data.getSerie();

    this.toutesMesSeries = uniquementSeries;

    this.seriesEnCours = uniquementSeries.filter(s => s.episodeToSee > 0);
  }

  async getSerie(): Promise<DataSerieModel[]> {
    return await this.data.getSerie();
  }

}
