import {Component, inject} from '@angular/core';
import {OMDbService} from "../OMDB/OMDB.service";
import { Router } from '@angular/router';

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

  constructor() {}

  lancerRecherche(){
    this.contenus = [];
    if (this.searchQuery.trim() !== '') {
      this.OMDB.searchQuery(this.searchQuery).subscribe((res: any) => {

        if (res.Search) {
          this.contenus = res.Search;
        }
      });
    }
  }

  voirDetails(id: string) {
    this.router.navigate(['/details', id]);
  }

}
