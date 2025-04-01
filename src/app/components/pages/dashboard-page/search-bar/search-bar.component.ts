import { Component } from '@angular/core';
import { PlacesService } from '../../../services/places.service';

@Component({
    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styles: ``,
    styleUrl: './search-bar.component.css',
    standalone: false
})
export class SearchBarComponent {
  
  private debounceTimer?: NodeJS.Timeout;

  constructor( private placesService: PlacesService ) { }


  onQueryChanged( query: string = '' ) {

    // console.log(query)

    // evaluo si todavia tiene un valor y si lo tiene lo limpio
    if ( this.debounceTimer ) clearTimeout( this.debounceTimer );

    // 
    this.debounceTimer = setTimeout(() => {
      // envio query 
      this.placesService.getPlacesByQuery( query );
    }, 350 );    

  }

}
