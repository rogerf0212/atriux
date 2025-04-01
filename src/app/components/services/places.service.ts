import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChildActivationEnd } from '@angular/router';
import { rejects } from 'assert';
import { Feature, PlacesResponse } from '../interfaces/places.interfaces';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public useLocation?: [number,number] | undefined;

  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];
  
  get isUserLocationReady(): boolean {
    return !!this.useLocation
  }

  constructor( private http: HttpClient, private mapService: MapService) { 

    this.getUserLocation();

  }
 
  public async getUserLocation(): Promise<[number,number]> {

    return new Promise((resolve,reject) => {

      navigator.geolocation.getCurrentPosition( 
        ({coords}) => {
          this.useLocation = [coords.longitude, coords.latitude];
          resolve(this.useLocation);
        },
        (err) => {
          alert('no se pudo obtener la geolocalitation')
          console.log(err);
          reject();
        }
      );

    });

  }


  getPlacesByQuery(query: string = ''){
    // todo: evaluar cuando el query es un string

    // no ejecutes nada cuando este el texto vacio
    if ( query.length === 0 ) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }
    
    this.isLoadingPlaces = true;

    this.http.get<PlacesResponse>(`https://api.mapbox.com/search/geocode/v6/forward?q=${query}&proximity=-74.03395978151613,40.7821302340285&language=es&access_token=pk.eyJ1IjoiYXRyaXV4ZGlvciIsImEiOiJjbTB5Zmd3cXYwbnluMnNxM3pwYzdqbmh5In0.j0iwWvxXungrWmMkU3nIsQ`)
    .subscribe( resp => {

    //  nombre de los nuevos lugares
      // console.log(resp.features)
      console.log('Lugares obtenidos:', this.places); 
      this.isLoadingPlaces = false;
      this.places = resp.features;

      this.mapService.createMarkersFromPlaces(this.places, this.useLocation!);
    });
  }

}
