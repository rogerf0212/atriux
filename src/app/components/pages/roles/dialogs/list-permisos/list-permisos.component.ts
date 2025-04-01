import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissions } from '../../../../interfaces/roles.interfaces';
import { RolesService } from '../../../../services/roles.service';


@Component({
    templateUrl: './list-permisos.component.html',
    styles: ``,
    standalone: false
})
export class ListPermisosComponent implements OnInit {
  public permisos: RolePermissions;

  constructor(
    private permisoService: RolesService,
    public dialogRef: MatDialogRef<ListPermisosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RolePermissions // Recibe los datos de permisos
  ) {
    this.permisos = data; // Asignar los permisos recibidos a la variable
    console.log(this.permisos)
  }

  ngOnInit(): void {
    
  }
}