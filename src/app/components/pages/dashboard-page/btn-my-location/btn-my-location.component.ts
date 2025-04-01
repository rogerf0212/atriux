import { Component } from '@angular/core';
import { PlacesService } from '../../../services/places.service';
import { MapService } from '../../../services/map.service';

@Component({
    selector: 'map-boton',
    templateUrl: './btn-my-location.component.html',
    styles: ``,
    styleUrl: './btn-my-location.component.css',
    standalone: false
})
export class BtnMyLocationComponent {

  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) { }

  goToMyLocation() {

    if ( !this.placesService.isUserLocationReady ) throw Error('No hay ubicación de usuario');
    if ( !this.mapService.isMapReady ) throw Error('No hay mapa disponible');
    
    
    this.mapService.flyTo( this.placesService.useLocation! );

  }


}
