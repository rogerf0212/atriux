import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../pages/services/auth.services';
import { AuthStatus } from '../interfaces';

// export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   // Verificar el estado de autenticación
//   const status = authService.authStatus();

//   // Si el estado es "checking", no redirigir aún
//   if (status === AuthStatus.checking) {
//       return true; // Permitir que continúe la carga de la aplicación
//   }

//   // Si está autenticado, permitir el acceso
//   if (status === AuthStatus.authenticated) {
//       return true;
//   }

//   // Redirigir a la página de login si no está autenticado
//   router.navigate(['/auth/login']);
//   return false; // Bloquear el acceso
// };

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const status = authService.authStatus();
  console.log('Estado de autenticación:', status); // Log para verificar el estado

  if (status === AuthStatus.checking) {
      console.log('Estado: Checking, permitiendo carga...');
      return true; // Permitir que continúe la carga de la aplicación
  }

  if (status === AuthStatus.authenticated) {
      // console.log('Estado: Autenticado, permitiendo acceso...');
      return true;
  }

  console.log('Estado: No autenticado, redirigiendo a login...');
  router.navigate(['/auth/login']);
  return false; // Bloquear el acceso
};