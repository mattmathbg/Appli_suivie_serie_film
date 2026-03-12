export class DataSerieModel {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  nbSeasons: number;
  nbEpisodes: number;
  seasonToSee: number;
  episodeToSee: number;
  episodeToBeSeen: number;
  episodeToSeeTitle: string;
  episodeToBeSeenTitle: string;
  note: number;
  lastDate: Date;


  constructor(
    id: number,
    name: string,
    imageUrl: string,
    description: string,
    nbSeasons: number,
    nbEpisodes: number,
    seasonToSee: number,
    episodeToSee: number,
    episodeToBeSeen: number,
    episodeToSeeTitle: string,
    episodeToBeSeenTitle: string,
    note: number,
    lastDate: Date = new Date()
  ) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.description = description;
    this.nbSeasons = nbSeasons;
    this.nbEpisodes = nbEpisodes;
    this.seasonToSee = seasonToSee;
    this.episodeToSee = episodeToSee;
    this.episodeToBeSeen = episodeToBeSeen;
    this.episodeToSeeTitle = episodeToSeeTitle;
    this.episodeToBeSeenTitle = episodeToBeSeenTitle;
    this.note = note;
    this.lastDate = lastDate;
  }

}
