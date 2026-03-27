import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {OMDbService} from "../OMDB/OMDB.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Notification } from '../Services/Notification';
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
export class DetailsPage{
  //contient tout ce que l'API donne (titre,acteurs etc)
  mediaDetails: any = null;
  private route = inject(ActivatedRoute);
  private OMDB = inject(OMDbService);
  private NotificationService = inject(Notification);
  protected dataService = inject(DataService);
  public estSauvegarde: boolean = false;
  private cd = inject(ChangeDetectorRef);

  constructor() { }

  async meRappeler() {
    const dureeMinutes = this.mediaDetails.Runtime; // ex: "45 min" depuis l'API OMDb
    const dureeMs = parseInt(dureeMinutes) * 60 * 1000;

    await LocalNotifications.schedule({
      notifications: [{
        title: "⏱️ C'est fini ?",
        body: `Mets à jour ton avancement pour ${this.mediaDetails.Title} !`,
        id: this.mediaDetails.Id,
        schedule: { at: new Date(Date.now() + dureeMs) }
      }]
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

  /**
   * Sert a initialiser la page comme ngOnInit mais
   * remplace ngOnInit car elle se relance à chaque fois qu'on arrive sur la page
   * ngOnInit lui ne se lance qu'une seule fois donc si on revenait sur la page
   * après un ajout/suppression, le bouton ne se mettrait pas à jour.
   */
  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.OMDB.getDetails(id).subscribe(async (res: any) => {
        this.mediaDetails = res;
        //on verifie si le film est dans le storage
        this.estSauvegarde = await this.dataService.checkIfSaved(this.mediaDetails.imdbID);
      });
    }
  }


}
