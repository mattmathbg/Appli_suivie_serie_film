import {Component, inject} from '@angular/core';
import {DataService} from "../Services/data.service";
import {DataSerieModel} from "../models/data-serie.model";
import {DataFilmModel} from "../models/data-film.models";


@Component({
  selector: 'app-films-page',
  templateUrl: 'Films.page.html',
  styleUrls: ['Films.page.scss'],
  standalone: false,
})
export class FilmsPage {

  private data = inject(DataService);
  public DataFilms: DataFilmModel[] = [];
  public FilmsEnCours: DataFilmModel[] = [];
  public toutMesFilms: DataFilmModel[] = [];
  constructor() {}

  async ngOnInit() {
    const listFilm = await this.data.getContenues();

    if (listFilm ) {
      this.DataFilms = listFilm
        .filter(item => item.type === 'movie')
        .map(item => new DataFilmModel(item));
    }
  }


  async ionViewWillEnter() {
    const uniquementFilm = await this.data.getFilm();

    this.toutMesFilms = uniquementFilm;

    this.FilmsEnCours = uniquementFilm.filter(s => s.currentTime > 0);
  }

  async getSerie(): Promise<DataFilmModel[]> {
    return await this.data.getFilm();
  }

}
