import {Component, inject, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

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
  private route = inject(ActivatedRoute);

  voirDetails(id: string) {
    this.router.navigate(['details', id], { relativeTo: this.route });
  }

  constructor() {}

}
