import {Component, inject} from '@angular/core';
import {OMDbService} from "../OMDB/OMDB.service";
import {ActivatedRoute, Router} from '@angular/router';
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
  private route = inject(ActivatedRoute);

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
    //relativeTo permet de dire depuis ou je construis le chemin
    this.router.navigate(['details', id], { relativeTo: this.route });
  }

  async ajouterContent(filmOMDb: any) {
    // On récupère les détails complets depuis OMDb avant de sauvegarder
    this.OMDB.getDetails(filmOMDb.imdbID).subscribe(async (details: any) => {
      let nouveauContenu;

      if (filmOMDb.Type === 'movie') {
        nouveauContenu = new DataFilmModel({
          id: details.imdbID,
          name: details.Title,
          imageUrl: details.Poster,
          type: 'movie',
          runtime: details.Runtime,
          duration: parseInt(details.Runtime) || 0,
          plot: details.Plot,
          actors: details.Actors,
          rating: details.imdbRating,
          estAjoute: true
        });
      } else {
        nouveauContenu = new DataSerieModel({
          id: details.imdbID,
          name: details.Title,
          imageUrl: details.Poster,
          type: 'series',
          plot: details.Plot,
          runtime: details.Runtime,
          actors: details.Actors,
          rating: details.imdbRating,
          nbSeasons: parseInt(details.totalSeasons) || 0,
          estAjoute: true
        });
      }

      await this.dataService.addContenue(nouveauContenu);
      filmOMDb.estAjoute = true;
    });
  }

}
