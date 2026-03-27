import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OMDbService {

  private apiUrl = 'https://www.omdbapi.com';
  private APIKEY = '3b4e5246';
  private http = inject(HttpClient);

  constructor() { }



  searchQuery(nom : string){
    return this.http.get(this.apiUrl+ '/?s=' + nom +'&apikey='+this.APIKEY);
  }

  getDetails(id: string) {
    return this.http.get(this.apiUrl + '/?i=' + id + '&apikey=' + this.APIKEY);
  }

}
