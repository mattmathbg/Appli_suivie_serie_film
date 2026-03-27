import {Component, inject, OnInit} from '@angular/core';
import {OMDbService} from "../OMDB/OMDB.service";
import {ActivatedRoute, Router} from "@angular/router";
import { Notification } from '../Services/Notification';
import {LocalNotifications} from "@capacitor/local-notifications";
import {DataService} from "../Services/data.service";
import {DataSerieModel} from "../models/data-serie.model";
import {ExplorerPage} from "../explorer/explorer.page";

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage implements OnInit{
  //contient tout ce que l'API donne (titre,acteurs etc)
  mediaDetails: any = null;
  private route = inject(ActivatedRoute);
  private OMDB = inject(OMDbService);
  private NotificationService = inject(Notification);
  private dataService = inject(DataService);




  constructor() { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.OMDB.getDetails(id).subscribe((res: any) => {
        this.mediaDetails = res;
      });
    }
  }

  async lancerNotification() {
    console.log("1 - bouton cliqué");

    const permissions = await LocalNotifications.requestPermissions();
    console.log("2 - permission reçue :", JSON.stringify(permissions));

    if (permissions.display !== 'granted') {
      console.log("3 - permission REFUSÉE, on arrête");
      return;
    }

    console.log("4 - permission OK, on envoie la notif");

    await LocalNotifications.schedule({
      notifications: [{
        title: "Test",
        body: "Ça marche !",
        id: 1,
        schedule: { at: new Date(Date.now() + 3000) }, // dans 3 secondes
      }]
    });

    console.log("5 - notification programmée !");
  }

  async supprimer() {
    await this.dataService.Supprimer(this.mediaDetails.imdbID);
  }


}
