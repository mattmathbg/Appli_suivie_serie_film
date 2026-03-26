import {Component, inject, OnInit} from '@angular/core';
import {OMDbService} from "../OMDB/OMDB.service";
import {ActivatedRoute} from "@angular/router";
import { Notification } from '../Services/Notification';

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

  lancerNotification() {
    const titre = "Rappel de série";
    const message = "Le prochain épisode de votre série sort aujourd'hui !";
    this.NotificationService.requestPermissions();
    this.NotificationService.scheduleNotification(titre, message, 1,)
  }

}
