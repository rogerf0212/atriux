import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { NewRole } from '../../../../interfaces/roles.interfaces';
import { RolesService } from '../../../../services/roles.service';

import Swal from 'sweetalert2';

@Component({
    templateUrl: './update-rol-dialog.component.html',
    styles: ``,
    standalone: false
})
export class UpdateRolDialogComponent {
  public rolForm: FormGroup;


//   get currentUnit(): NewRole {
//     const rol = this.rolForm.value as NewRole;

//     return rol;
//  }

  get currentRol(): NewRole {
    return {
      // Code: this.rolForm.value.Code || '',
      description: this.rolForm.value.Description || '',
    };
  }

 constructor(
  private rolService: RolesService,
  public dialogRef: MatDialogRef<UpdateRolDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: NewRole // Recibe los datos de la unidad
) {
  // Inicializa el formulario aquí
  this.rolForm = new FormGroup({
      id: new FormControl(this.data.id), // Asegúrate de incluir el ID
      // Code: new FormControl(this.data.Code),
      description: new FormControl(this.data.description),
  });
}

closeDialog() {
  this.dialogRef.close(); // Cierra el diálogo
}


onSubmit() {
  if (this.rolForm.valid) {
      const currentUnit = this.rolForm.value as NewRole; // Obtiene el valor del formulario
      console.log('Rol a actualizar:', currentUnit); // Verifica que el ID esté presente

      if (currentUnit.id) { // Verifica que el ID esté presente
          this.rolService.updateRol(currentUnit).subscribe(
              (unit) => {
                  console.log('Rol actualizado:', unit);
                  this.dialogRef.close(unit); // Cierra el diálogo y pasa los datos actualizados

                  // Mostrar SweetAlert de éxito
                  Swal.fire({
                      title: 'Éxito!',
                      text: 'El rol ha sido actualizada correctamente.',
                      icon: 'success',
                      confirmButtonText: 'Aceptar'
                  });
              },
              (error) => {
                  console.error('Error al actualizar el rol:', error); // Manejo de errores
                  Swal.fire({
                      title: 'Error!',
                      text: 'No se pudo actualizar el rol. Intenta nuevamente.',
                      icon: 'error',
                      confirmButtonText: 'Aceptar'
                  });
              }
          );
      } else {
          console.error('No se puede actualizar, ID de unidad no válido');
      }
  } else {
      console.error('Formulario inválido');
  }
}


}
