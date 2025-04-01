import { Component } from '@angular/core';

@Component({
    templateUrl: './search-page.component.html',
    styles: ``,
    styleUrl: './search-page.component.css',
    standalone: false
})
export class SearchPageComponent {

  activeTab = 'tab1'; // Tab activa por defecto

  // Método para cambiar la pestaña activa
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }


  isOpen = false; // Estado inicial del acordeón

  toggleAccordion() {
    this.isOpen = !this.isOpen; // Cambia el estado al hacer clic
  }
}
