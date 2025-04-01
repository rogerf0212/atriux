import { Component } from '@angular/core';
import { PlacesService } from '../../../services/places.service';
import { Feature } from '../../../interfaces/places.interfaces';

import { MapService } from '../../../services/map.service';

@Component({
    selector: 'search-result',
    templateUrl: './search-results.component.html',
    styles: ``,
    styleUrl: './search-results.component.css',
    standalone: false
})
export class SearchResultsComponent {

  // cuando se selecciona la ubicacion
  public selectedId: string = '';

  constructor( 
    private placesService: PlacesService,
    private mapService: MapService,
  ) { }


  // carga los lugares
  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }


  get places(): Feature[] {
    return this.placesService.places;
  }

  // recibo el lugar
  flyTo(place: Feature) {
    // Verifica si geometry y coordinates están definidos
    if (place.geometry && place.geometry.coordinates && place.geometry.coordinates.length === 2) {
        this.selectedId = place.id; 
        const [lng, lat] = place.geometry.coordinates; // Accede a las coordenadas directamente
        this.mapService.flyTo([lng, lat]);
    } else {
        console.error('Coordinates are not defined for place:', place);
    }
}

// para obtener la ubicacion de un punto a otro
getDirections(place: Feature ){

  // si no tenemos el userLocation
  if (!this.placesService.useLocation) throw Error('no hay userLocation')

  const start = this.placesService.useLocation;
  const end = place.geometry.coordinates as [number,number];

  this.mapService.getRouteBetweenPoints(start, end)

}


}
