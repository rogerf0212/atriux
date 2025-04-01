import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissionModule, RolePermissions } from '../../../../interfaces/roles.interfaces';
import { RolesService } from '../../../../services/roles.service';
import { NamesPermisosComponent } from '../../namesPermisos/names-permisos/names-permisos.component';

import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { AddPermisosComponent } from '../add-permisos/add-permisos.component';


import Swal from 'sweetalert2';

@Component({
    templateUrl: './show-permisos.component.html',
    styles: ``,
    standalone: false
})
export class ShowPermisosComponent implements OnInit{
  public permisos?: RolePermissions;
  public permisosNombres = new NamesPermisosComponent().permisoNombres;
  public searchText: string = '';

  public pageSize = 10;
  public pageIndex = 0;
  public length = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private rolesService: RolesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      this.rolesService.getPermisoById(id).subscribe(unit => {
        this.permisos = unit[0];
        console.log({ unit });
        this.length = Object.keys(this.permisos).length - 2; // Total de permisos menos los excluidos
      });
    });
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  get paginatedPermisos() {
    if (!this.permisos) return [];
    const startIndex = this.pageIndex * this.pageSize;
  
    // Filtrar los permisos para excluir 'id' y 'roles_id'
    const filteredPermisos = Object.entries(this.permisos)
      .filter(([key]) => key !== 'id' && key !== 'roles_id' && 
        this.permisosNombres[key]?.toLowerCase().includes(this.searchText.toLowerCase())); // Filtrar por búsqueda
  
    this.length = filteredPermisos.length; // Actualiza la longitud después del filtrado
    return filteredPermisos.slice(startIndex, startIndex + this.pageSize);
  }

  saveChanges() {
    if (!this.permisos) return;

    const updatedPermisos = {
      roles_id: this.permisos.roles_id,
      ...Object.fromEntries(
        Object.entries(this.permisos).filter(([key]) => key !== 'id' && key !== 'roles_id')
          .map(([key, value]) => [key, value ? 1 : 0]) // Convertir a 1 o 0
      )
    };

    this.rolesService.updatePermisos(updatedPermisos).subscribe(
      (response) => {
        console.log('Permisos actualizados:', response);
        Swal.fire({
          title: 'Éxito!',
          text: 'Los permisos han sido actualizados correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      (error) => {
        console.error('Error al actualizar los permisos:', error);
        Swal.fire({
          title: 'Error!',
          text: 'No se pudieron actualizar los permisos. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  onCheckboxChange(key: string, event: any) {
    if (this.permisos) {
      this.permisos[key] = event.checked ? 1 : 0; // Asigna 1 si está marcado, 0 si no
      console.log(`Permiso "${key}" cambiado a: ${this.permisos[key]}`); // Registro del cambio
    }
  }

  getPermisoValue(key: string): number | undefined {
    return this.permisos ? this.permisos[key] : undefined;
  }
  
  setPermisoValue(key: string, value: number) {
    if (this.permisos) {
      this.permisos[key] = value;
    }
  }


  goBack(): void {
    this.router.navigateByUrl('pages/roles');
  }

}