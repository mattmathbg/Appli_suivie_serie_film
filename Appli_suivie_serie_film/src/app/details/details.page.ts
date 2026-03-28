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
  public serieTerminee: boolean = false;

  constructor() {}


  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.OMDB.getDetails(id).subscribe(async (res: any) => {
      this.mediaDetails = res;

      this.estSauvegarde = await this.dataService.checkIfSaved(this.mediaDetails.imdbID);
      this.dureeFilm = parseInt(this.mediaDetails.Runtime) || 0;

      if (this.estSauvegarde) {
        const tousLesContenus = await this.dataService.getContenues();
        const contenu = tousLesContenus.find(c => c.id === this.mediaDetails.imdbID);

        if (contenu && contenu.type === 'movie') {
          this.currentTime = (contenu as DataFilmModel).currentTime;
        }

        if (contenu && contenu.type === 'series') {
          this.episodeToSee = (contenu as DataSerieModel).episodeToSee;
          this.seasonToSee = (contenu as DataSerieModel).seasonToSee;

          // Si nbEpisodes est à 0, la série a été ajoutée sans cette info
          // On appelle l'API pour connaître le nb d'épisodes de la saison actuelle
          if ((contenu as DataSerieModel).nbEpisodes === 0) {
            this.OMDB.getSaison(this.mediaDetails.imdbID, this.seasonToSee).subscribe(async (saisonRes: any) => {
              if (saisonRes.Episodes) {
                (contenu as DataSerieModel).nbEpisodes = saisonRes.Episodes.length;
                await this.dataService.mettreAJour(tousLesContenus);
              }
            });
          }
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

    // Nb de saisons totales depuis l'API OMDb ("4" → 4)
    const nbSaisonsTotal = parseInt(this.mediaDetails.totalSeasons) || 99;

    // Nb d'épisodes de la saison actuelle — stocké dans le modèle
    // On utilise nbEpisodes comme "épisodes de la saison courante"
    const nbEpisodesSaisonActuelle = (contenu as DataSerieModel)?.nbEpisodes || 99;

    if (this.episodeToSee < nbEpisodesSaisonActuelle) {
      // Cas normal : on avance dans la même saison
      this.episodeToSee++;
      if (contenu && contenu.type === 'series') {
        await this.sauvegarderEpisode();
      }

    } else if (this.seasonToSee < nbSaisonsTotal) {
      // On est au dernier épisode → on passe à la saison suivante
      const prochaineSaison = this.seasonToSee + 1;

      // Appel API pour connaître le nb d'épisodes de la saison suivante
      this.OMDB.getSaison(this.mediaDetails.imdbID, prochaineSaison).subscribe(async (res: any) => {
        // L'API renvoie un tableau "Episodes" avec tous les épisodes de la saison
        const nbEpisodesSuivante = res.Episodes ? res.Episodes.length : 99;

        // On met à jour la saison et on repart à l'épisode 1
        this.seasonToSee = prochaineSaison;
        this.episodeToSee = 1;

        // On met à jour le modèle avec le nouveau nb d'épisodes de cette saison
        if (contenu && contenu.type === 'series') {
          (contenu as DataSerieModel).nbEpisodes = nbEpisodesSuivante;
          (contenu as DataSerieModel).seasonToSee = this.seasonToSee;
          (contenu as DataSerieModel).episodeToSee = this.episodeToSee;
          await this.dataService.mettreAJour(tousLesContenus);
        }
      });

    } else {
      // Dernière saison, dernier épisode → série terminée
      this.serieTerminee = true;
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
