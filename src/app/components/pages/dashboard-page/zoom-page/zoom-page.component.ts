import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild,  } from '@angular/core';

// clases
import {LngLat, Map, Marker, Popup} from 'mapbox-gl';

import { PlacesService } from '../../../services/places.service';
import { MapService } from '../../../services/map.service';


@Component({
    selector: 'app-mapa',
    templateUrl: './zoom-page.component.html',
    styles: ``,
    styleUrl: './zoom-page.component.css',
    standalone: false
})
export class ZoomPageComponent implements AfterViewInit, OnDestroy {

  constructor(private placesService: PlacesService, private mapService: MapService){}

  @ViewChild('map') divMap?: ElementRef;

  public zoom: number = 10;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-66.90349184254751, 10.502884932210762);


  ngAfterViewInit(): void {

    if ( !this.divMap ) throw 'El elemento HTML no fue encontrado';
    if ( !this.placesService.useLocation ) throw Error('No hay placesService.userLocation');

    // this.map = new Map({
    //   container: this.divMap.nativeElement, // container ID
    //   style: 'mapbox://styles/mapbox/streets-v12', // style URL
    //   center: this.currentLngLat,
    //   zoom: this.zoom, // starting zoom
    // });

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.useLocation,
      zoom: this.zoom, // starting zoom
    });

    this.mapListeners();

    // const marker = new Marker()
    // .setLngLat(this.currentLngLat)
    // .addTo(this.map)


    const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este lugar del mundo</span>
      `);

    new Marker({ color: 'red' })
      .setLngLat( this.placesService.useLocation )
      .setPopup( popup )
      .addTo(this.map)

      // ir a mi ubicacion
      this.mapService.setMap(this.map);

  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners() {
    if ( !this.map ) throw 'Mapa no inicializado';

    this.map.on('zoom', (ev) => {
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if ( this.map!.getZoom() < 18 ) return;
      this.map!.zoomTo(18);
    });

    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter();
    });

  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomChanged( value: string ) {
    this.zoom = Number(value);
    this.map?.zoomTo( this.zoom );
  }


}
