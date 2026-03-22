import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OMDbService {

  private apiUrl = 'http://www.omdbapi.com';
  private APIKEY = '3b4e5246';

  constructor(private http:HttpClient) { }



  searchQuery(nom : string){
    return this.http.get(this.apiUrl+ '/?s=' + nom +'&apikey='+this.APIKEY);
  }

  getDetails(id: string) {
    return this.http.get(this.apiUrl + '/?i=' + id + '&apikey=' + this.APIKEY);
  }

}
