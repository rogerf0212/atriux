import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ComponentsRoutingModule } from './components-routing.module';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { NgChartsModule } from 'ng2-charts';
import { GoogleMapsModule } from '@angular/google-maps'; // Importar GoogleMapsModule

import { DashboardPageComponent } from './pages/dashboard-page/mapComplete/dashboard-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/unidad_organizativa-page/list-page.component';
import { NewPageComponent } from './pages/detail-unit/new-page.component';
import { SearchPageComponent } from './pages/settings-page/search-page.component';
import { UnitDialogComponent } from './pages/dialogs/unit-dialog/unit-dialog.component';
import { UnitEditDialogComponent } from './pages/dialogs/unit-edit-dialog/unit-edit-dialog.component';
import { ConfirmDialogComponent } from './pages/dialogs/confirm-dialog/confirm-dialog.component';
import { UnitVentaEditDialogComponent } from './unidad-venta/dialogs/unit-venta-edit-dialog/unit-venta-edit-dialog.component';
import { UnitVentaDialogComponent } from './unidad-venta/dialogs/unit-venta-dialog/unit-venta-dialog.component';
import { UnidadVentaConfirmDialogComponent } from './unidad-venta/dialogs/unidad-venta-confirm-dialog/unidad-venta-confirm-dialog.component';
import { DetailUnitVentaComponent } from './unidad-venta/detail-unit-venta/detail-unit-venta.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { MapHousesComponent } from './pages/dashboard-page/map-houses/map-houses.component';
import { UsersComponent } from './pages/users/users.component';
import { ClientsComponent } from './pages/clients/clients-list/clients.component';
import { ClientDetailComponent } from './pages/clients/client-detail/client-detail.component';
import { ZoomPageComponent } from './pages/dashboard-page/zoom-page/zoom-page.component';
import { LoadingComponent } from './pages/dashboard-page/loading/loading.component';
import { BtnMyLocationComponent } from './pages/dashboard-page/btn-my-location/btn-my-location.component';
import { SearchBarComponent } from './pages/dashboard-page/search-bar/search-bar.component';
import { SearchResultsComponent } from './pages/dashboard-page/search-results/search-results.component';
import { RolesComponent } from './pages/roles/roles.component';
import { ActividadesComponent } from './pages/clients/actividades/actividades.component';
import { AddActividadesComponent } from './pages/clients/dialogs/add-actividades/add-actividades.component';
import { ListPermisosComponent } from './pages/roles/dialogs/list-permisos/list-permisos.component';
import { AddRolDialogComponent } from './pages/roles/dialogs/add-rol-dialog/add-rol-dialog.component';
import { UpdateRolDialogComponent } from './pages/roles/dialogs/update-rol-dialog/update-rol-dialog.component';
import { ShowPermisosComponent } from './pages/roles/dialogs/show-permisos/show-permisos.component';
import { NamesPermisosComponent } from './pages/roles/namesPermisos/names-permisos/names-permisos.component';
import { DeleteRolComponent } from './pages/roles/dialogs/delete-rol/delete-rol.component';
import { AddPermisosComponent } from './pages/roles/dialogs/add-permisos/add-permisos.component';
import { AddUserComponent } from './pages/users/dialogs/add-user/add-user.component';
import { EditUserComponent } from './pages/users/dialogs/edit-user/edit-user.component';
import { DeleteUserComponent } from './pages/users/dialogs/delete-user/delete-user.component';
import { AddClientDialogComponent } from './pages/clients/add-client-dialog/add-client-dialog.component';
import { EditClientDialogComponent } from './pages/clients/edit-client-dialog-component/edit-client-dialog.component';
import { MeetingsAgendaComponent } from './pages/clients/actividades/meetings-agenda/meetings-agenda.component';
import { ContactsComponent } from './pages/clients/actividades/contacts/contacts.component';
import { ActivitiesComponent } from './pages/clients/actividades/activities/activities.component';
import { CallActivitiesComponent } from './pages/clients/actividades/tipo-actividades/call-activities-component/call-activities-component.component';
import { EmailActivitiesComponent } from './pages/clients/actividades/email-activities/email-activities.component';
import { ClientManageComponent } from './pages/clients/servicios-clientes/client-manage/client-manage.component';
import { PaymentRelationchipComponent } from './pages/clients/servicios-clientes/payment-relationchip/payment-relationchip.component';
import { AlmacenComponent } from './pages/almacen/almacen.component';
import { UnitListComponent } from './unidad-venta/unidad-venta/unidad-venta.component';
import { AddUnitDialogComponent } from './unidad-venta/dialogs/add-unit-dialog/add-unit-dialog.component';
import { AddWarehouseDialogComponent } from './pages/almacen/dialogos/add-warehouse-dialog/add-warehouse-dialog.component';
import { EditWarehouseDialogComponent } from './pages/almacen/dialogos/edit-warehouse-dialog/edit-warehouse-dialog.component';
import { ProductosComponent } from './pages/productos/productos/productos.component';
import { ProducManageComponent } from './pages/productos/produc-manage/produc-manage.component';
import { AlmacenDetailComponent } from './pages/almacen/almacen-detail/almacen-detail.component';
import { OrdenesComponent } from './pages/ordenes/ordenes.component';
import { OrdenesClientesComponent } from './pages/ordenes/ordenes-clientes/ordenes-clientes.component';
import { CreateOrderDialogComponent } from './pages/ordenes/create-order-dialog/create-order-dialog.component';
import { CamionesComponent } from './pages/camiones/camiones.component';
import { CargaDeCamionesComponent } from './pages/camiones/carga-de-camiones/carga-de-camiones.component';
import { RutasComponent } from './pages/rutas/rutas.component';
import { RutaDetalleComponent } from './pages/rutas/rutas-detalle/ruta-detalle.component';
import { FormatDatePipe } from '../pipes/format-date.pipe';
import { OrdenesDetalleComponent } from './pages/ordenes/ordenes-detalle/ordenes-detalle.component';

@NgModule({
  declarations: [
    DashboardPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    NewPageComponent,
    SearchPageComponent,
    UnitDialogComponent,
    UnitEditDialogComponent,
    ConfirmDialogComponent,
    UnitVentaEditDialogComponent,
    UnitVentaDialogComponent,
    UnidadVentaConfirmDialogComponent,
    DetailUnitVentaComponent,
    DashboardComponent,
    MapHousesComponent,
    UsersComponent,
    ClientsComponent,
    ClientDetailComponent,
    ZoomPageComponent,
    LoadingComponent,
    BtnMyLocationComponent,
    SearchBarComponent,
    SearchResultsComponent,
    RolesComponent,
    ActividadesComponent,
    AddActividadesComponent,
    ListPermisosComponent,
    AddRolDialogComponent,
    UpdateRolDialogComponent,
    ShowPermisosComponent,
    NamesPermisosComponent,
    DeleteRolComponent,
    AddPermisosComponent,
    AddUserComponent,
    EditUserComponent,
    DeleteUserComponent,
    AddClientDialogComponent,
    EditClientDialogComponent,
    MeetingsAgendaComponent,
    ContactsComponent,
    ActivitiesComponent,
    CallActivitiesComponent,
    EmailActivitiesComponent,
    ClientManageComponent,
    PaymentRelationchipComponent,
    AlmacenComponent,
    UnitListComponent,
    AddUnitDialogComponent,
    AddWarehouseDialogComponent,
    EditWarehouseDialogComponent,
    ProductosComponent,
    ProducManageComponent,
    AlmacenDetailComponent,
    OrdenesComponent,
    OrdenesClientesComponent,
    CreateOrderDialogComponent,
    CamionesComponent,
    CargaDeCamionesComponent,
    RutasComponent,
    RutaDetalleComponent,
    FormatDatePipe,
    OrdenesDetalleComponent,
   
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsRoutingModule,
    MaterialModule,
    RoundProgressModule,
    NgChartsModule,
    GoogleMapsModule // Añadir GoogleMapsModule aquí
  ],
  providers: []
})
export class ComponentsModule { }
