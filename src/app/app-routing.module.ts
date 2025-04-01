import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './shared/pages/error404/error404.component';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { MeetingsAgendaComponent } from './components/pages/clients/actividades/meetings-agenda/meetings-agenda.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'pages',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule),
  },
  {
    path: 'meetings-agenda',
    component: MeetingsAgendaComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: '404',
    component: Error404Component,
  },
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
