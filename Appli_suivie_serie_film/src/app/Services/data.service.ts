import {inject, Injectable} from '@angular/core';
import {DataSerieModel} from "../models/data-serie.model";
import { Storage } from '@ionic/storage-angular';
import {DataFilmModel} from "../models/data-film.models";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _storage: Storage | null = null;
  private readonly STORAGE_KEY = 'my_series';
  private storage = inject(Storage);

  public dataSeries: (DataSerieModel | DataFilmModel)[] = [
    {
      id: '',
      name: "Dune: Prophecy",
      imageUrl: "assets/images/dune_prophecy.webp",
      type: 'series',
      estAjoute: true,
      description: "Dans un futur où l'humanité a voyagé à travers la galaxie des milles planètes, une mystérieuse sororité appelée Bene Gesserit navigue entre les batailles politiques et les imbroglios de l'Imperium, poursuivant un but bien précis et bien à lui qui va amener ses membres jusqu'à l'énigmatique planète de Dune…",
      nbSeasons: 1,
      nbEpisodes: 4,
      seasonToSee: 1,
      episodeToSee: 4,
      episodeToSeeTitle: "Twice Born",
      note: 4.7,
      lastDate: new Date(),
    }
  ];

  constructor() {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Récupérer les séries et les transformer en instances de classe
  async getContenues(): Promise<(DataSerieModel | DataFilmModel)[]> {
    const data = await this._storage?.get(this.STORAGE_KEY);
    if (!data) return [];

    // On transforme chaque item en l'instance correspondante
    return data.map((item: any) => {
      if (item.type === 'film') {
        return new DataFilmModel(item);
      } else {
        return new DataSerieModel(item);
      }
    });
  }

  // Ajouter une seule série
  async addContenue(NContenue: DataSerieModel| DataFilmModel) {
    const all = await this.getContenues();
    all.push(NContenue);
    this.dataSeries = all; // Mise à jour de la liste locale
    await this._storage?.set(this.STORAGE_KEY, all);
  }

  async checkIfSaved(id: string): Promise<boolean> {
    const all = await this.getContenues();
    return all.some(item => item.id == id);
  }

  async getFilm(): Promise<DataFilmModel[]> {
    const all = await this.getContenues();
    return all.filter(item => item.type === 'movie');
  }

  async getSerie(): Promise<DataSerieModel[]> {
    const all = await this.getContenues();
    return all.filter(item => item.type === 'series');
  }

  public getLenDataSeries(): number{
    return this.dataSeries.length;
  }
  public getDataSeries(): (DataSerieModel | DataFilmModel)[] {
    return this.dataSeries;
  }

  public getDataSerieById(id: number): (DataSerieModel | DataFilmModel) {
    return this.dataSeries[id];
  }


  //Promise permet de dire que la fonction va finir son travail
  //cela evite que angular passe a la suite avant que la fonction ne soit fini
  //ce qui pourrait causer des bug
  async Supprimer(id: string): Promise<void> {
    //await permet d'attendre que la ligne se fini car si on arrive pas
    //a recupérer le contenu ça peut buger
    const all = await this.getContenues();
    const filtered = all.filter(item => item.id !== id);
    await this._storage?.set(this.STORAGE_KEY, filtered);
  }

}
