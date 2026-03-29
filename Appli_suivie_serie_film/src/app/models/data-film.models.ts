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

  runtime: string = '';
  currentTime: number = 0;
  duration: number = 0;
  percentViewed: number = 0;

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

  updatePercentage() {
    if (this.duration > 0) {
      this.percentViewed = Math.round((this.currentTime / this.duration) * 100);
    }
  }
}
