import {Component, inject, OnInit} from '@angular/core';
import {OMDbService} from "../OMDB/OMDB.service";
import {ActivatedRoute} from "@angular/router";
import { Notification } from '../Services/Notification';
import {LocalNotifications} from "@capacitor/local-notifications";

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

    const permissions = await LocalNotifications.requestPermissions();

    if (permissions.display !== 'granted') {
      return;
    }

    await LocalNotifications.schedule({
      notifications: [{
        title: "Test",
        body: "Ça marche !",
        id: 1,
        schedule: { at: new Date(Date.now() + 3000) }, // dans 3 secondes
      }]
    });

  }

}
