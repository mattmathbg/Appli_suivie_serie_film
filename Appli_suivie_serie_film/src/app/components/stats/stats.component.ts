import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
    imports: [
        IonicModule
    ]
})
export class StatsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
