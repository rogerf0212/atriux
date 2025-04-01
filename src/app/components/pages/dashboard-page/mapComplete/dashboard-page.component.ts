import { AfterViewInit, Component, ElementRef, OnInit, ViewChild,  } from '@angular/core';

import {Map} from 'mapbox-gl';
import { PlacesService } from '../../../services/places.service';


@Component({
    templateUrl: './dashboard-page.component.html',
    styles: ``,
    styleUrl: './dashboard-page.component.css',
    standalone: false
})
export class DashboardPageComponent {

  constructor(private placesService: PlacesService){

  }

 get isUserLocationReady() {
  return this.placesService.isUserLocationReady;
 }


}
