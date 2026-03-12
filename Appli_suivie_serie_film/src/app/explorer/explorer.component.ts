import { Component } from '@angular/core';
import { IonSearchbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-explorer',
  templateUrl: 'explorer.component.html',
  styleUrls: ['explorer.component.css'],
  imports: [IonSearchbar],
})
export class ExampleComponent {
  constructor() {

  }
}
