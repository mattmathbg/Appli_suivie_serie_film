import {Component, inject, OnInit} from '@angular/core';
import {OMDbService} from "../OMDB/OMDB.service";
import {ActivatedRoute} from "@angular/router";


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
  constructor() { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.OMDB.getDetails(id).subscribe((res: any) => {
        this.mediaDetails = res;
      });
    }
  }

}
