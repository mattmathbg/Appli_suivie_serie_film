import {Component, inject} from '@angular/core';
import {OMDbService} from "../OMDB/OMDB.service";
import { Router } from '@angular/router';
import {DataSerieModel} from "../models/data-serie.model";
import {DataService} from "../Services/data.service";
import {DataFilmModel} from "../models/data-film.models";
import {FormulaireAjoutComponent} from "../components/formulaire-ajout/formulaire-ajout.component";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-explorer-page',
  templateUrl: 'explorer.page.html',
  styleUrls: ['explorer.page.scss'],
  standalone: false,
})
export class ExplorerPage {
  /*SearchQuery sera mis en a jour en two way binding , cela synchronise  la variable avec ce que l'utilisateur
  * tape donc pas besoin de le faire dans lancerRecherche
  * */
  public searchQuery: string = '';
  protected contenus: any[] = [];
  public OMDB = inject(OMDbService);
  private router = inject(Router);
  private dataService = inject(DataService);
  private modalCtrl = inject(ModalController);

  constructor() {}

  async lancerRecherche() {
    this.contenus = [];

    if (this.searchQuery.trim() !== '') {
      this.OMDB.searchQuery(this.searchQuery).subscribe(async (res: any) => {
        if (res.Search) {
          const resultatsBruts = res.Search;

          for (let film of resultatsBruts) {
            film.estAjoute = await this.dataService.checkIfSaved(film.imdbID);
          }
          this.contenus = resultatsBruts;
        }
      });
    }
  }

  async OuvertureAjout() {
    const modal = await this.modalCtrl.create({
      component: FormulaireAjoutComponent,
      initialBreakpoint: 0.8, // Monte un peu plus haut (80%)
      breakpoints: [0, 0.5, 0.8, 1],
      handle: true // Ajoute la petite barre grise en haut pour que l'utilisateur puisse tirer la modale
    });

    await modal.present();

}

  voirDetails(id: string) {
    this.router.navigate(['/details', id]);
  }

  async ajouterContent(filmOMDb: any) {
    let nouveauContenu;

    if (filmOMDb.Type === 'movie') {
      nouveauContenu = new DataFilmModel({
        id: filmOMDb.imdbID,
        name: filmOMDb.Title,
        imageUrl: filmOMDb.Poster,
        type: 'movie',
        estAjoute: true
      });
    } else {
      nouveauContenu = new DataSerieModel({
        id: filmOMDb.imdbID,
        name: filmOMDb.Title,
        imageUrl: filmOMDb.Poster,
        type: 'series',
        estAjoute: true
      });
    }

    await this.dataService.addContenue(nouveauContenu);
    filmOMDb.estAjoute = true;
  }

}
