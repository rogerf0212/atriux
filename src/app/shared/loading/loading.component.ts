import { Component } from '@angular/core';

@Component({
    selector: 'app-loading',
    template: `
    <div class="loading-spinner">
      <p>Cargando...</p> <!-- Aquí puedes agregar un spinner o un ícono -->
    </div>
  `,
    styles: [`
    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh; /* Ocupa toda la altura de la ventana */
      font-size: 24px;
    }
  `],
    standalone: false
})
export class LoadingComponent {

}
