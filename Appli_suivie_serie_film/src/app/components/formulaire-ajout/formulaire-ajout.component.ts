import {Component, inject, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {DataService} from "../../Services/data.service";
import {DataFilmModel} from "../../models/data-film.models";
import {DataSerieModel} from "../../models/data-serie.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-formulaire-ajout',
  templateUrl: './formulaire-ajout.component.html',
  styleUrls: ['./formulaire-ajout.component.scss'],
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class FormulaireAjoutComponent  {
  // Injections
  private modalCtrl = inject(ModalController);
  private dataService = inject(DataService);

  // Données du formulaire
  nomSaisi: string = '';
  type: 'movie' | 'series' = 'movie';
  dureeSaisie: number = 0;
  saisonsSaisi: number = 1;
  episodesSaisi: number = 1;

  constructor() { }


  // Fermer la pop-up
  annuler() {
    this.modalCtrl.dismiss();
  }

  // Enregistrer le contenu
  async enregistrer() {
    if (!this.nomSaisi || this.nomSaisi.trim() === '') {
      alert('Veuillez entrer un nom');
      return;
    }

    const idUnique = 'manuel_' + Date.now();
    let nouveauContenu;


    if (this.type === 'movie') {
      nouveauContenu = new DataFilmModel({
        id: idUnique,
        name: this.nomSaisi,
        imageUrl: 'assets/img/imgParDefaut.png',
        type: this.type,
        estAjoute: true,
        lastDate: new Date(),
        duration: this.dureeSaisie
      });
    } else {
      nouveauContenu = new DataSerieModel({
        id: idUnique,
        name: this.nomSaisi,
        imageUrl: `assets/img/imgParDefaut.png`,
        type: this.type,
        estAjoute: true,
        lastDate: new Date(),
        nbSeasons: this.saisonsSaisi,
        nbEpisodes: this.episodesSaisi
      });
    }

    await this.dataService.addContenue(nouveauContenu);

    this.modalCtrl.dismiss({ added: true });
  }
}
