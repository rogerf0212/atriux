import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/detail-unit/new-page.component';
import { SearchPageComponent } from './pages/settings-page/search-page.component';
import { ListPageComponent } from './pages/unidad_organizativa-page/list-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/mapComplete/dashboard-page.component';
import { DetailUnitVentaComponent } from './unidad-venta/detail-unit-venta/detail-unit-venta.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { MapHousesComponent } from './pages/dashboard-page/map-houses/map-houses.component';
import { UsersComponent } from './pages/users/users.component';
import { ClientsComponent } from './pages/clients/clients-list/clients.component';
import { ClientDetailComponent } from './pages/clients/client-detail/client-detail.component';
import { ZoomPageComponent } from './pages/dashboard-page/zoom-page/zoom-page.component';
import { RolesComponent } from './pages/roles/roles.component';
import { ShowPermisosComponent } from './pages/roles/dialogs/show-permisos/show-permisos.component';
import { AlmacenComponent } from './pages/almacen/almacen.component';
import { UnitListComponent } from './unidad-venta/unidad-venta/unidad-venta.component';
import { ProductosComponent } from './pages/productos/productos/productos.component';
import { ProducManageComponent } from './pages/productos/produc-manage/produc-manage.component';
import { AlmacenDetailComponent } from './pages/almacen/almacen-detail/almacen-detail.component';
import { OrdenesComponent } from './pages/ordenes/ordenes.component';
import { OrdenesClientesComponent } from './pages/ordenes/ordenes-clientes/ordenes-clientes.component';
import { CamionesComponent } from './pages/camiones/camiones.component';
import { CargaDeCamionesComponent } from './pages/camiones/carga-de-camiones/carga-de-camiones.component';
import { RutasComponent } from './pages/rutas/rutas.component';
import { RutaDetalleComponent } from './pages/rutas/rutas-detalle/ruta-detalle.component';
import { OrdenesDetalleComponent } from './pages/ordenes/ordenes-detalle/ordenes-detalle.component'; // Importar nuevo componente

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'new-page', component: NewPageComponent },
      { path: 'settings', component: SearchPageComponent },
      { path: 'unidades-organizativas/:id', component: NewPageComponent },
      { path: 'unidades-organizativas', component: ListPageComponent },
      { path: 'rutas', component: RutasComponent },
      { path: 'ruta-detalle/:id/:description', component: RutaDetalleComponent },
      { path: 'mapa', component: DashboardPageComponent },
      { path: 'zoom-mapa', component: ZoomPageComponent },
      { path: 'unidades-ventas/:id', component: DetailUnitVentaComponent },
      { path: 'unidades-ventas', component: UnitListComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsersComponent },
      { path: 'clientes', component: ClientsComponent },
      { path: 'clientes-detalle/:id', component: ClientDetailComponent },  
      { path: 'roles', component: RolesComponent },
      { path: 'roles/:id', component: ShowPermisosComponent},
      { path: 'almacen', component: AlmacenComponent }, 
      { path: 'almacen/:id', component: AlmacenDetailComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'product-manage', component: ProducManageComponent},
      { path: 'ordenes', component: OrdenesComponent},
      { path: 'ordenes-clientes/:id', component: OrdenesClientesComponent},
      { path: 'ordenes-detalle/:id', component: OrdenesDetalleComponent }, // Nueva ruta
      { path: 'camiones', component: CamionesComponent},
      { path: 'carga-de-camiones/:id/:description', component: CargaDeCamionesComponent },
      { path: '**', redirectTo: 'dashboard' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
