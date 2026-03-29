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

  mediaDetails!: DataSerieModel | DataFilmModel ;

  private route = inject(ActivatedRoute);
  private OMDB = inject(OMDbService);
  private NotificationService = inject(Notification);
  protected dataService = inject(DataService);
  private cd = inject(ChangeDetectorRef);


  name: string = '';
  imageUrl: string = '';
  type: 'movie' = 'movie';
  estAjoute: boolean = false;
  description: string = '';
  actors: string = '';
  rating: number = 0;
  plot: string = '';
  nbSeasons: number = 0;
  nbEpisodes: number = 0;
  seasonToSee: number = 1;
  episodeToSee: number = 1;
  episodeToSeeTitle: string = '';
  public estSauvegarde: boolean = false;
  public dureeFilm: number = 0;
  public currentTime: number = 0;
  public serieTerminee: boolean = false;
  public id: string ='';

  constructor() {}


  async ionViewWillEnter() {
      const id = this.route.snapshot.paramMap.get('id');
      this.id = id ?? '';
    if (!this.id) return;

    this.estSauvegarde = this.dataService.checkIfSaved(this.id);

    if (this.estSauvegarde) {
      this.mediaDetails = this.dataService.getDataSerieById(this.id);
      this.dureeFilm = (this.mediaDetails as DataFilmModel).duration || 0;


      if (this.mediaDetails.type === 'movie') {
        this.currentTime = (this.mediaDetails as DataFilmModel).currentTime;
      }

      if (this.mediaDetails.type === 'series') {
        this.episodeToSee = (this.mediaDetails as DataSerieModel).episodeToSee;
        this.seasonToSee = (this.mediaDetails as DataSerieModel).seasonToSee;
      }

    }else {
      this.OMDB.getDetails(this.id).subscribe((res: any) => {
        this.mediaDetails = res;
        this.dureeFilm = parseInt(res.Runtime) || 0;
        this.name = res.Title;
        this.imageUrl = res.Poster;
        this.description = res.Plot;
        this.actors = res.Actors;
        this.rating = parseFloat(res.imdbRating) || 0;
        this.plot = res.Plot;
        this.nbSeasons = parseInt(res.totalSeasons) || 0;
        this.currentTime = 0;
        this.episodeToSee = 1;
        this.seasonToSee = 1;
        this.serieTerminee = false;
      });
    }
  }

  async ajouter() {
    this.OMDB.getDetails(this.id).subscribe(async ( details: any) => {
      let nouveauContenu;

      if (details.Type === 'movie') {
        nouveauContenu = new DataFilmModel({
          id: details.imdbID,
          name: details.Title,
          imageUrl: details.Poster,
          type: 'movie',
          runtime: details.Runtime,
          duration: parseInt(details.Runtime) || 0,
          plot: details.Plot,
          actors: details.Actors,
          rating: details.imdbRating
        });
      } else {
        nouveauContenu = new DataSerieModel({
          id: details.imdbID,
          name: details.Title,
          imageUrl: details.Poster,
          type: 'series',
          plot: details.Plot,
          actors: details.Actors,
          rating: details.imdbRating,
          nbSeasons: parseInt(details.totalSeasons) || 0
        });
      }

      await this.dataService.addContenue(nouveauContenu);
      this.mediaDetails.estAjoute = true;
    });
  }

  async supprimer() {
    await this.dataService.Supprimer(this.mediaDetails.id);
    this.estSauvegarde = false;
  }


  // Appelée quand l'utilisateur lâche le slider
  async sauvegarderProgression() {
    const tousLesContenus = await this.dataService.getContenues();
    const contenu = tousLesContenus.find(c => c.id === this.mediaDetails.id);

    if (contenu && contenu.type === 'movie') {
      // On modifie l'objet directement dans le tableau (c'est une référence)
      (contenu as DataFilmModel).currentTime = this.currentTime;
      // Puis on réécrit tout le tableau dans le storage
      await this.dataService.mettreAJour(tousLesContenus);
    }
  }


  async episodeSuivant() {
    const tousLesContenus = await this.dataService.getContenues();
    const contenu = tousLesContenus.find(c => c.id === this.mediaDetails.id);


    // Nb de saisons totales depuis l'API OMDb ("4" → 4)
    const nbSaisonsTotal = (contenu as DataSerieModel)?.nbSeasons || 99;

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
      this.OMDB.getSaison(this.mediaDetails.id, prochaineSaison).subscribe(async (res: any) => {
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
    const contenu = tousLesContenus.find(c => c.id === this.mediaDetails.id);

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
    const contenu = tousLesContenus.find(c => c.id === this.mediaDetails.id);

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
    const dureeMinutes = parseInt(this.mediaDetails.runtime) || 0;

    await this.NotificationService.scheduleNotification(
      "⏱️ C'est fini ?",
      `Mets à jour ton avancement pour ${this.mediaDetails.name} !`,
      this.mediaDetails.id,
      this.mediaDetails.poster,
      dureeMinutes * 60  // le service attend des secondes
    );
  }
}
