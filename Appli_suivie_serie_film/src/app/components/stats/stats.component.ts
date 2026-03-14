import {Component, inject, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {DataSerieModel} from "../../models/data-serie.model";
import {DataService} from "../../Services/data.service";

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
    imports: [
        IonicModule
    ]
})
export class StatsComponent  implements OnInit {
  private data = inject(DataService);
  nbSerieFilms! : number;

  constructor() { }

  ngOnInit(): void {
    this.nbSerieFilms = this.getLenDataSeries();
  }

  public getLenDataSeries(): number{
    return this.data.getLenDataSeries();
  }

  protected readonly DataSerieModel = DataSerieModel;
}
