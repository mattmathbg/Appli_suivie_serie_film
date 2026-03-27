import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.page.html',
  styleUrls: ['./parametre.page.scss'],
  standalone: false,
})
export class ParametrePage {
  modeClair: boolean = false;

  constructor() {
    this.modeClair = document.body.classList.contains('light-mode');
  }

  toggleDarkMode(event: any) {
    const boutonEstCoche = event.detail.checked;
    this.applyTheme(boutonEstCoche);
  }

  applyTheme(light: boolean) {
    this.modeClair = light;
    document.body.classList.toggle('light-mode', light);
  }

  resetTheme() {
    this.applyTheme(false);
  }
}
