import { Component, inject, OnInit } from '@angular/core';
import { DataService } from "../../Services/data.service";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  standalone: false,
})
export class StatsComponent {
  private dataService = inject(DataService);

  constructor() { }

  getTotal(): number {
    return this.dataService.getLenTotal();
  }

  getNbSeries(): number {
    return this.dataService.getNbSeries();
  }

  getNbFilms(): number {
    return this.dataService.getNbFilms();
  }
}
