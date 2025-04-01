import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places.interfaces';
import { HttpClient } from '@angular/common/http';
import { DirectionsResponse, Route } from '../interfaces/directions';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];
  private mapboxToken = 'pk.eyJ1IjoiZm5kYW4wMSIsImEiOiJjbTVhNGxncWEweDh1Mm5vOTF0ajdyd2U2In0.LchmjZ9xmAH1rlvtOxg2zQ';

  get isMapReady() {
    return !!this.map;
  }

  constructor(private http: HttpClient) {
    if (!this.mapboxToken) {
      throw new Error('Un token de acceso a la API es necesario para usar Mapbox GL.');
    }
  }

  setMap(map: Map) {
    this.map = map;
  }

  getMapboxToken(): string {
    return this.mapboxToken;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('El mapa no está inicializado');
    
    this.map?.flyTo({
      zoom: 14,
      center: coords
    });
  }

  getReverseGeocoding(coords: [number, number]): Observable<any> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${this.getMapboxToken()}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Error en la geocodificación inversa:', error);
        return throwError(error);
      })
    );
  }

  searchLocation(query: string): Observable<any> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${this.getMapboxToken()}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Error en la búsqueda de ubicación:', error);
        return throwError(error);
      })
    );
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) throw Error('Mapa no inicializado');

    this.markers.forEach(marker => marker.remove());
    const newMarkers: Marker[] = [];

    for (const place of places) {
      const [lng, lat] = place.geometry.coordinates;
      const popup = new Popup()
        .setHTML(`
          <h6>${place.properties.name}</h6>
          <span>${place.properties.full_address}</span>
        `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map);
      
      newMarkers.push(newMarker);
    }

    this.markers = newMarkers;

    if (places.length === 0) return;
    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);
    
    this.map.fitBounds(bounds, {
      padding: 200
    });
  }

  getRouteBetweenPoints(start: [number, number], end: [number, number]): Observable<Route> {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(',')};${end.join(',')}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${this.getMapboxToken()}`;
    return this.http.get<DirectionsResponse>(url).pipe(
      map(response => response.routes[0]),
      catchError(error => {
        console.error('Error al obtener la ruta entre puntos:', error);
        return throwError(error);
      })
    );
  }

  public drawPolyline(route: Route) {
    if (!route || !route.geometry || !route.geometry.coordinates) {
      console.error('Invalid route data');
      return;
    }
  
    const coords = route.geometry.coordinates;
    if (coords.some(coord => isNaN(coord[0]) || isNaN(coord[1]))) {
      console.error('Invalid coordinates in route data', coords);
      return;
    }
  
    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });
  
    if (!this.map) throw Error('Mapa no está inicializado');
  
    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
  
    this.map?.fitBounds(bounds, {
      padding: 200
    });
  
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          }
        ]
      }
    };
  
    if (this.map.getLayer('RouteString')) {
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }
  
    this.map.addSource('RouteString', sourceData);
  
    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'black',
        'line-width': 3
      }
    });
  }
  
}
