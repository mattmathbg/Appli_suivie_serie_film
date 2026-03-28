import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {OMDbService} from "../OMDB/OMDB.service";
import {ActivatedRoute} from "@angular/router";
import {Notification} from '../Services/Notification';
import {LocalNotifications} from "@capacitor/local-notifications";
import {DataService} from "../Services/data.service";
import {DataSerieModel} from "../models/data-serie.model";
import {DataFilmModel} from "../models/data-film.models";

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage {

  mediaDetails: any = null;

  private route = inject(ActivatedRoute);
  private OMDB = inject(OMDbService);
  private NotificationService = inject(Notification);
  protected dataService = inject(DataService);
  private cd = inject(ChangeDetectorRef);

  public estSauvegarde: boolean = false;
  public dureeFilm: number = 0;
  public currentTime: number = 0;
  public episodeToSee: number = 1;
  public seasonToSee: number = 1;

  constructor() {}


  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.OMDB.getDetails(id).subscribe(async (res: any) => {
      this.mediaDetails = res;

      // Vérifie si ce contenu est déjà dans le storage
      this.estSauvegarde = await this.dataService.checkIfSaved(this.mediaDetails.imdbID);

      // "120 min" → 120   (parseInt coupe tout après le premier nombre)
      // || 0 = si ça échoue, on met 0 par défaut
      this.dureeFilm = parseInt(this.mediaDetails.Runtime) || 0;

      // Si le contenu est sauvegardé, on charge sa progression
      if (this.estSauvegarde) {
        const tousLesContenus = await this.dataService.getContenues();

        // .find() cherche dans le tableau l'élément dont l'id correspond
        const contenu = tousLesContenus.find(c => c.id === this.mediaDetails.imdbID);

        if (contenu && contenu.type === 'movie') {
          // "as DataFilmModel" dit à TypeScript : traite cet objet comme un film
          this.currentTime = (contenu as DataFilmModel).currentTime;
        }

        if (contenu && contenu.type === 'series') {
          this.episodeToSee = (contenu as DataSerieModel).episodeToSee;
          this.seasonToSee = (contenu as DataSerieModel).seasonToSee;
        }
      }
    });
  }

  async ajouter() {
    let nouveauContenu;

    if (this.mediaDetails.Type === 'movie') {
      nouveauContenu = new DataFilmModel({
        id: this.mediaDetails.imdbID,
        name: this.mediaDetails.Title,
        imageUrl: this.mediaDetails.Poster,
        type: 'movie'
      });
    } else {
      nouveauContenu = new DataSerieModel({
        id: this.mediaDetails.imdbID,
        name: this.mediaDetails.Title,
        imageUrl: this.mediaDetails.Poster,
        type: 'series'
      });
    }

    await this.dataService.addContenue(nouveauContenu);
    this.estSauvegarde = true;
  }

  async supprimer() {
    await this.dataService.Supprimer(this.mediaDetails.imdbID);
    this.estSauvegarde = false;
  }


  // Appelée quand l'utilisateur lâche le slider
  async sauvegarderProgression() {
    const tousLesContenus = await this.dataService.getContenues();
    const contenu = tousLesContenus.find(c => c.id === this.mediaDetails.imdbID);

    if (contenu && contenu.type === 'movie') {
      // On modifie l'objet directement dans le tableau (c'est une référence)
      (contenu as DataFilmModel).currentTime = this.currentTime;
      // Puis on réécrit tout le tableau dans le storage
      await this.dataService.mettreAJour(tousLesContenus);
    }
  }


  async episodeSuivant() {
    const tousLesContenus = await this.dataService.getContenues();
    const contenu = tousLesContenus.find(c => c.id === this.mediaDetails.imdbID);

    // Récupère le nb de saisons depuis l'API OMDb (ex: "4" → 4)
    const nbSaisonsTotal = parseInt(this.mediaDetails.totalSeasons) || 99;

    // Récupère le nb d'épisodes par saison depuis le modèle sauvegardé
    // Si pas dispo, on met 99 pour ne jamais bloquer
    const nbEpisodesParSaison = (contenu as DataSerieModel)?.nbEpisodes
      ? Math.round((contenu as DataSerieModel).nbEpisodes / nbSaisonsTotal)
      : 99;

    console.log('Saison:', this.seasonToSee, '/', nbSaisonsTotal);
    console.log('Episode:', this.episodeToSee, '/', nbEpisodesParSaison);

    if (this.episodeToSee < nbEpisodesParSaison) {
      this.episodeToSee++;
    } else if (this.seasonToSee < nbSaisonsTotal) {
      this.seasonToSee++;
      this.episodeToSee = 1;
    } else {
      console.log('Série terminée !');
      return;
    }

    if (contenu && contenu.type === 'series') {
      await this.sauvegarderEpisode();
    }
  }

  async episodePrecedent() {
    const tousLesContenus = await this.dataService.getContenues();
    const contenu = tousLesContenus.find(c => c.id === this.mediaDetails.imdbID);

    // Si pas sauvegardé, on décrémente juste localement
    if (!contenu || contenu.type !== 'series') {
      if (this.episodeToSee > 1) this.episodeToSee--;
      return;
    }

    const serie = contenu as DataSerieModel;
    const nbEpisodesParSaison = serie.nbEpisodes || 99;

    if (this.episodeToSee > 1) {
      this.episodeToSee--;
    } else if (this.seasonToSee > 1) {
      this.seasonToSee--;
      this.episodeToSee = nbEpisodesParSaison;
    } else {
      return; // S1E1, on ne peut pas reculer
    }

    await this.sauvegarderEpisode();
  }

  async sauvegarderEpisode() {
    const tousLesContenus = await this.dataService.getContenues();
    const contenu = tousLesContenus.find(c => c.id === this.mediaDetails.imdbID);

    if (contenu && contenu.type === 'series') {
      (contenu as DataSerieModel).episodeToSee = this.episodeToSee;
      // On sauvegarde aussi la saison courante
      (contenu as DataSerieModel).seasonToSee = this.seasonToSee;
      await this.dataService.mettreAJour(tousLesContenus);
    }
  }

  async meRappeler() {
    // On réutilise le service Notification au lieu d'appeler LocalNotifications directement
    // C'est plus propre et cohérent avec le reste de l'app
    const dureeMinutes = parseInt(this.mediaDetails.Runtime) || 0;

    await this.NotificationService.scheduleNotification(
      "⏱️ C'est fini ?",
      `Mets à jour ton avancement pour ${this.mediaDetails.Title} !`,
      this.mediaDetails.imdbID,
      this.mediaDetails.Poster,
      dureeMinutes * 60  // le service attend des secondes
    );
  }
}
