import { inject, Injectable } from '@angular/core';
import { DataSerieModel } from "../models/data-serie.model";
import { Storage } from '@ionic/storage-angular';
import { DataFilmModel } from "../models/data-film.models";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _storage: Storage | null = null;
  private readonly STORAGE_KEY = 'my_series';
  private storage = inject(Storage);

  public dataSeries: (DataSerieModel | DataFilmModel)[] = [];

  constructor() {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
    await this.loadAll();
  }

  async mettreAJour(liste: (DataSerieModel | DataFilmModel)[]): Promise<void> {
    await this._storage?.set(this.STORAGE_KEY, liste);
  }

  private async loadAll() {
    const data = await this._storage?.get(this.STORAGE_KEY);
    if (data) {
      this.dataSeries = data.map((item: any) => {
        return item.type === 'movie' ? new DataFilmModel(item) : new DataSerieModel(item);
      });
    }
  }

  public getContenues(): (DataSerieModel | DataFilmModel)[] {
    return this.dataSeries;
  }


  public getFilm(): DataFilmModel[] {
    return this.dataSeries.filter(item => item.type === 'movie') as DataFilmModel[];
  }


  public getSerie(): DataSerieModel[] {
    return this.dataSeries.filter(item => item.type === 'series') as DataSerieModel[];
  }


  public getLenTotal(): number {
    return this.dataSeries.length;
  }

  public getNbSeries(): number {
    return this.getSerie().length;
  }

  public getNbFilms(): number {
    return this.getFilm().length;
  }


  async addContenue(NContenue: DataSerieModel | DataFilmModel) {
    this.dataSeries.push(NContenue);
    await this._storage?.set(this.STORAGE_KEY, this.dataSeries);
  }

  async Supprimer(id: string): Promise<void> {
    this.dataSeries = this.dataSeries.filter(item => item.id !== id);
    await this._storage?.set(this.STORAGE_KEY, this.dataSeries);
  }

  public getDataSerieById(id: string): (DataSerieModel | DataFilmModel) | undefined {
    return this.dataSeries.find(item => item.id === id);
  }

  public getDataSeries(): (DataSerieModel | DataFilmModel)[] {
    return this.dataSeries;
  }

  public checkIfSaved(id: string): boolean {
    return this.dataSeries.some(item => item.id === id);
  }


  async clearStorage() {
    await this._storage?.clear();
  }

}
