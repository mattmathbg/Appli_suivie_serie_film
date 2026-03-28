export class DataFilmModel {
  id: string = '';
  name: string = '';
  imageUrl: string = '';
  type: 'movie' = 'movie';
  estAjoute: boolean = false;
  description: string = '';
  actors: string = '';
  rating: number = 0;
  plot: string = '';


  // --- Propriétés de progression spécifiques au FILM ---
  runtime: string = '';      // Durée totale (ex: "120 min")
  currentTime: number = 0;   // Temps visionné en minutes
  duration: number = 0;      // Durée totale en minutes (pour les calculs)
  percentViewed: number = 0; // Pourcentage de progression (0 à 100)

  note: number = 0;
  lastDate: Date = new Date();

  constructor(fields?: Partial<DataFilmModel>) {
    if (fields) {
      Object.assign(this, fields);
      if (fields.lastDate) {
        this.lastDate = new Date(fields.lastDate);
      }
      this.updatePercentage();
    }
  }

  // Petite méthode pour calculer automatiquement la barre de progression
  updatePercentage() {
    if (this.duration > 0) {
      this.percentViewed = Math.round((this.currentTime / this.duration) * 100);
    }
  }
}
