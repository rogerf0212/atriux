import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/pages/services/auth.services';

import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
    templateUrl: './layout-page.component.html',
    styles: ``,
    styleUrls: ['./layout-page.component.css'] // Corregir typo en styleUrls
    ,
    standalone: false
})
export class LayoutPageComponent implements OnInit {
  // @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  myData: any[] = [];

  private authServices = inject(AuthService);

  public user = computed(() => this.authServices.currentUser());

  // Método para Verificar Permisos que verifica si el usuario tiene acceso a un módulo específico basado en sus permisos.
  public hasPermission(permissionName: string): boolean {
    const permissions = this.authServices.getPermissions();

    if (permissions) {
      return permissions.some((perm: any) => perm[permissionName] === 1);
    }

    return false;
  }

  public sidebarItems = [
    { label: 'Dashboard', icon: 'home', url: './dashboard', permission: 'list_unit_org' },
    { label: 'Unidades Organizativas', icon: 'label', url: './unidades-organizativas', permission: 'list_unit_org' },
    { label: 'Unidades Ventas', icon: 'label', url: './unidades-ventas', permission: 'list_sales_org' },
    { label: 'Rutas', icon: 'map', url: './rutas', permission: 'list_routes' },
    { label: 'Usuarios', icon: 'supervised_user_circle', url: './usuarios', permission: 'list_users' },
    { label: 'Clientes', icon: 'group', url: './clientes', permission: 'list_accounts' },
    { label: 'Roles', icon: 'domain', url: './roles', permission: 'list_roles' },
    { label: 'Almacén', icon: 'inventory', url: './almacen', permission: 'list_warehouses' },
    { label: 'Productos', icon: 'category', url: './productos', permission: 'list_warehouses' },
    { label: 'Product-manage', icon: 'category', url: "./product-manage", permission: 'list_warehouses'},
    { label: 'Ordenes', icon: 'list_alt', url: "./ordenes", permission: 'list_orders'},
    { label: 'Camiones', icon: 'local_shipping', url: './camiones', permission: 'list_trucks' } 
  ];

  // Filtrar elementos del menú según los permisos del usuario
  public getFilteredSidebarItems() {
    const items = this.sidebarItems.filter(item => this.hasPermission(item.permission));
    // console.log('Filtered Sidebar Items:', items);
    return items;
  }

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // this.myData = this.authService.getData();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  onSettings() {
    this.router.navigate(['/pages/settings']);
  }
}
