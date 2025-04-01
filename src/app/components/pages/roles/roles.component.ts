import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { RolesService } from '../../services/roles.service';
import { NewRole, Role, RolePermissions } from '../../interfaces/roles.interfaces';
import { ListPermisosComponent } from './dialogs/list-permisos/list-permisos.component';
import { AddRolDialogComponent } from './dialogs/add-rol-dialog/add-rol-dialog.component';
import { UpdateRolDialogComponent } from './dialogs/update-rol-dialog/update-rol-dialog.component';
import { DeleteRolComponent } from './dialogs/delete-rol/delete-rol.component';

@Component({
    templateUrl: './roles.component.html',
    styles: ``,
    standalone: false
})
export class RolesComponent implements OnInit {


  public permisos: RolePermissions[] = [];
  public roles: Role[] = [];


  constructor( private permisosService: RolesService, private dialog: MatDialog){

  }


  ngOnInit(): void {
    this.loadRoles();
  }

loadRoles() {
  this.permisosService.getRoles().subscribe(
    units => {
      console.log('roles recibidos:', units);
      this.roles = units;
    },
    error => {
      console.error('Error al obtener los roles:', error);
      this.roles = [];
    }
  );
}
openAddRoleDialog() {
  const dialogRef = this.dialog.open(AddRolDialogComponent, {
    width: '400px',
    data: {} 
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      
      this.roles.push(result);
    }
  });
}




togglePermission(permiso: RolePermissions, permissionKey: string): void {

  console.log(`Toggled ${permissionKey} for`, permiso);
}

openDialogEdit(rol: NewRole) {
  console.log('Rol a editar:', rol); // Verifica que el ID esté presente
  const dialogRef = this.dialog.open(UpdateRolDialogComponent, {
    data: rol // Pasa la unidad como datos al diálogo
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Rol editado:', result);
      const index = this.roles.findIndex(u => u.id === result.id);
      if (index !== -1) {
        this.roles[index] = result; // Actualiza la unidad editada
      }
    }
  });
}


onDeleteRol(role: Role) {
  const dialogRef = this.dialog.open(DeleteRolComponent, {
    data: role // Pasa el rol a eliminar al diálogo
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) { // Si el usuario confirma la eliminación
      if (role.id) { // Verifica que role.id esté definido
        this.permisosService.deleteRolById(role.id.toString()).subscribe(success => {
          if (success) {
            console.log('Rol eliminado exitosamente');
            // Actualiza la lista de roles
            this.roles = this.roles.filter(r => r.id !== role.id);
          } else {
            console.error('Error al eliminar el rol');
          }
        });
      } else {
        console.error('ID del rol no está definido');
      }
    }
  });
}

}


