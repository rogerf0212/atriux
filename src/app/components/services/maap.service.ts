import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private directionsService: google.maps.DirectionsService;
  private directionsRenderer: google.maps.DirectionsRenderer;
  private map!: google.maps.Map; // Usamos el operador de "definitivamente asignado"
  private geocoder: google.maps.Geocoder;

  constructor() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.geocoder = new google.maps.Geocoder();
  }

  setMap(map: google.maps.Map) {
    if (map) {
      this.map = map;
      this.directionsRenderer.setMap(this.map);
      console.log('Mapa configurado correctamente');
    } else {
      console.error('Mapa no configurado. La instancia del mapa no es válida.');
    }
  }

  calculateRoute(start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral): Observable<number> {
    return new Observable(observer => {
      const request: google.maps.DirectionsRequest = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          this.directionsRenderer.setDirections(result);
          const route = result.routes[0];
          let duration = 0;

          for (const leg of route.legs) {
            if (leg.duration && leg.duration.value) {
              duration += leg.duration.value;
            } else {
              console.error('Leg duration is undefined', leg);
              observer.error('Leg duration is undefined');
              return;
            }
          }

          observer.next(duration / 60); // duración en minutos
          observer.complete();
        } else {
          observer.error('Error al calcular la ruta: ' + status);
        }
      });
    });
  }

  geocodeAddress(address: string): Observable<google.maps.GeocoderResult[]> {
    return new Observable(observer => {
      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results) {
          observer.next(results);
          observer.complete();
        } else {
          observer.error('Error al geocodificar la dirección: ' + status);
        }
      });
    });
  }

  addMarker(position: google.maps.LatLngLiteral, title: string) {
    if (this.map) {
      const marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: title
      });
    } else {
      console.error('Mapa no inicializado');
    }
  }

  setCenter(position: google.maps.LatLngLiteral) {
    if (this.map) {
      this.map.setCenter(position);
    } else {
      console.error('Mapa no inicializado');
    }
  }

  setZoom(zoom: number) {
    if (this.map) {
      this.map.setZoom(zoom);
    } else {
      console.error('Mapa no inicializado');
    }
  }
}
