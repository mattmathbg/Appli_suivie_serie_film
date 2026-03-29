import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {OMDbService} from "../OMDB/OMDB.service";
import {ActivatedRoute} from "@angular/router";
import {Notification} from '../Services/Notification';
import {LocalNotifications} from "@capacitor/local-notifications";
import {DataService} from "../Services/data.service";
import {DataSerieModel} from "../models/data-serie.model";
import {DataFilmModel} from "../models/data-film.models";
import {Router} from "@angular/router";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage {

  mediaDetails!: DataSerieModel | DataFilmModel | undefined;

  private route = inject(ActivatedRoute);
  private OMDB = inject(OMDbService);
  private NotificationService = inject(Notification);
  protected dataService = inject(DataService);
  private cd = inject(ChangeDetectorRef);
  private router = inject(Router);
  private navCtrl = inject(NavController);


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
      this.mediaDetails = this.dataService.getDataSerieById(this.id) ?? undefined;
      if (!this.mediaDetails) { return; }
    }else {
      console.log("jsuis passe");
      this.OMDB.getDetails(this.id).subscribe((details: any) => {
        if (details.Type === 'movie') {
          this.mediaDetails = new DataFilmModel({
            id: details.imdbID,
            name: details.Title,
            imageUrl: details.Poster,
            type: 'movie',
            runtime: details.Runtime,
            duration: parseInt(details.Runtime) || 0,
            plot: details.Plot,
            actors: details.Actors,
            rating: details.imdbRating,
            estAjoute : true
          });
        } else {
          this.mediaDetails = new DataSerieModel({
            id: details.imdbID,
            name: details.Title,
            imageUrl: details.Poster,
            type: 'series',
            plot: details.Plot,
            runtime:details.Runtime,
            actors: details.Actors,
            rating: details.imdbRating,
            nbSeasons: parseInt(details.totalSeasons) || 0,
            estAjoute: true
          });
        }

      });
    }
    this.dureeFilm = (this.mediaDetails as DataFilmModel).duration || 0;
    if (this.mediaDetails?.type === 'movie') {
      this.currentTime = (this.mediaDetails as DataFilmModel).currentTime;
    }
    if (this.mediaDetails?.type === 'series') {
      this.episodeToSee = (this.mediaDetails as DataSerieModel).episodeToSee;
      this.seasonToSee = (this.mediaDetails as DataSerieModel).seasonToSee;
    }
  }

  async ajouter() {

    this.OMDB.getDetails(this.id).subscribe(async ( details: any) => {
      let nouveauContenu;
      if (!this.mediaDetails) { return; }

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
          rating: details.imdbRating,
          estAjoute : true
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
          runtime:details.Runtime,
          nbSeasons: parseInt(details.totalSeasons) || 0,
          estAjoute: true
        });
      }

      await this.dataService.addContenue(nouveauContenu);
      nouveauContenu.estAjoute = true;

      if (details.Type === 'movie') {
        this.router.navigate(['/tabs/Films']);
      } else {
        this.router.navigate(['/tabs/Series']);
      }
    });
  }

  async supprimer() {
    if (!this.mediaDetails) { return; }
    await this.dataService.Supprimer(this.mediaDetails.id);
    this.estSauvegarde = false;
    this.navCtrl.back();
  }


  // Appelée quand l'utilisateur lâche le slider
  async sauvegarderProgression() {
    if (!this.mediaDetails){return;}
    const tousLesContenus = await this.dataService.getContenues();

    let contenu = this.dataService.getDataSerieById(this.id) ?? undefined;

    if (contenu && contenu.type === 'movie') {
      // On modifie l'objet directement dans le tableau (c'est une référence)
      (contenu as DataFilmModel).currentTime = this.currentTime;
      // Puis on réécrit tout le tableau dans le storage
      await this.dataService.mettreAJour(tousLesContenus);
    }
  }


  async episodeSuivant() {
    if (!this.mediaDetails) return;

    const id = this.mediaDetails.id;
    const contenu = await this.dataService.getDataSerieById(id);

    if (!contenu || contenu.type !== 'series') return;
    const serie = contenu as DataSerieModel;

    // 1. Déterminer la limite d'épisodes actuelle
    // Si nbEpisodes est 0 ou inexistant, on met 10 par défaut pour les séries perso
    const limiteEpisodes = (serie.nbEpisodes && serie.nbEpisodes > 0) ? serie.nbEpisodes : 10;

    if (this.episodeToSee < limiteEpisodes) {
      // CAS A : On avance normalement dans la saison
      this.episodeToSee++;
      await this.sauvegarderEpisode();
    }
    else {
      // CAS B : On est au bout, on veut passer à la saison suivante
      const prochaineSaison = this.seasonToSee + 1;

      // --- VÉRIFICATION SÉRIE OMDB ---
      if (id.startsWith('tt')) {
        this.OMDB.getSaison(id, prochaineSaison).subscribe(async (res: any) => {
          if (res.Response === "True" && res.Episodes) {
            // On met à jour TOUT d'un coup : saison, épisode 1 ET le nouveau nb d'épisodes
            this.seasonToSee = prochaineSaison;
            this.episodeToSee = 1;

            // CRUCIAL : On met à jour le modèle avec le nombre d'épisodes de la NOUVELLE saison
            this.nbEpisodes = res.Episodes.length;
            await this.sauvegarderEpisode();
            console.log(`Passage à la S${prochaineSaison} avec ${res.Episodes.length} épisodes.`);
          } else {
            console.log("Fin de série ou saison non répertoriée sur OMDb.");
          }
        });
      }
      // --- VÉRIFICATION SÉRIE PERSO ---
      else {
        if (prochaineSaison <= (serie.nbSeasons || 99)) {
          this.seasonToSee = prochaineSaison;
          this.episodeToSee = 1;
          // Pour une série perso, on garde le même nombre d'épisodes par saison (ex: 10)
          await this.sauvegarderEpisode();
        }
      }
    }
  }

  async episodePrecedent() {
    const tousLesContenus = await this.dataService.getContenues();
    const  contenu = this.dataService.getDataSerieById(this.id) ?? undefined;
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
    // 1. Récupérer la liste complète du storage
    const tousLesContenus = await this.dataService.getContenues();

    // 2. Trouver l'index de la série dans CETTE liste précise
    const index = tousLesContenus.findIndex(c => c.id === this.id);

    // 3. Si on l'a trouvée et que c'est une série
    if (index !== -1 && tousLesContenus[index].type === 'series') {
      const serie = tousLesContenus[index] as DataSerieModel;

      // On met à jour les valeurs dans l'objet qui appartient à la liste
      serie.episodeToSee = this.episodeToSee;
      serie.seasonToSee = this.seasonToSee;
      serie.nbEpisodes = this.nbEpisodes; // C'est ici que le passage de saison est sauvé !

      // 4. On écrase l'ancienne liste par la nouvelle liste mise à jour
      await this.dataService.mettreAJour(tousLesContenus);
      console.log("Sauvegarde réussie :", serie.seasonToSee, serie.episodeToSee, "nbEps:", serie.nbEpisodes);
    }
  }

  async meRappeler() {
    if (!this.mediaDetails){return;}
    const dureeMinutes = parseInt(this.mediaDetails.runtime) || 0;

    await this.NotificationService.scheduleNotification(
     "⏱️ C'est fini ?",
      `Mets à jour ton avancement pour ${this.mediaDetails.name} !`,
      this.mediaDetails.id,
     this.mediaDetails.imageUrl,
      dureeMinutes * 60
    );
  }
}
