export class DataSerieModel {
  // On initialise avec des valeurs par défaut pour éviter l'erreur TS2564
  id: string = '';
  name: string = '';
  imageUrl: string = '';
  type: 'series' = 'series';
  estAjoute: boolean = false;
  description: string = '';
  nbSeasons: number = 0;
  nbEpisodes: number = 0;
  seasonToSee: number = 1;
  episodeToSee: number = 1;
  episodeToSeeTitle: string = '';
  note: number = 0;
  duree: number = 0;
  lastDate: Date = new Date();
  actors: string = '';
  rating: number = 0;
  plot: string = '';


  constructor(fields?: Partial<DataSerieModel>) {
    if (fields) {
      Object.assign(this, fields);

      if (fields.lastDate) {
        this.lastDate = new Date(fields.lastDate);
      }
    }
  }
}
