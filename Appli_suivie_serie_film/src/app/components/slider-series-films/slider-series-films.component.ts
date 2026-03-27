import {Component, inject, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-slider-series-films',
  templateUrl: './slider-series-films.component.html',
  styleUrls: ['./slider-series-films.component.scss'],
  standalone: false,
})
export class SliderSeriesFilmsComponent {

  @Input() titre: string = "Séries";
  @Input() listeSerieFilm: any[] = [];
  private router = inject(Router);

  voirDetails(id: string) {
    this.router.navigate(['/details', id]);
  }

  constructor() {}

}
