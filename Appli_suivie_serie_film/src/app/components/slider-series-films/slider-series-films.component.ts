import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-slider-series-films',
  templateUrl: './slider-series-films.component.html',
  styleUrls: ['./slider-series-films.component.scss'],
  standalone: false,
})
export class SliderSeriesFilmsComponent {

  @Input() titre: string = "Séries";
  @Input() listeSerieFilm: any[] = [];

  constructor() {}

}
