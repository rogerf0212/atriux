import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';
import { unitOrganizations } from '../../../interfaces/data.interfaces';
import { SalesService } from '../../../services/sales-organizations.service';

@Component({
    templateUrl: './unit-venta-edit-dialog.component.html',
    styles: ``,
    standalone: false
})
export class UnitVentaEditDialogComponent {

  public unitForm: FormGroup;


  get currentUnit(): unitOrganizations {
    const unit = this.unitForm.value as unitOrganizations;

    return unit;
 }

 constructor(
  private unitService: SalesService,
  public dialogRef: MatDialogRef<UnitVentaEditDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: unitOrganizations // Recibe los datos de la unidad
) {
  // Inicializa el formulario aquí
  this.unitForm = new FormGroup({
      id: new FormControl(this.data.id), // Asegúrate de incluir el ID
      Code: new FormControl(this.data.Code),
      Description: new FormControl(this.data.Description),
      created_at: new FormControl(this.data.created_at),
      Unit_Organization_id: new FormControl<number>(1)
  });
}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close(); // Cierra el diálogo
  }

  onSubmit() {
    if (this.unitForm.valid) {
        const currentUnit = this.unitForm.value as unitOrganizations; // Obtiene el valor del formulario
        console.log('Unidad a actualizar:', currentUnit); // Verifica que el ID esté presente

        if (currentUnit.id) { // Verifica que el ID esté presente
            this.unitService.updateUnit(currentUnit).subscribe(
                (unit) => {
                    console.log('Unidad actualizada:', unit);
                    this.dialogRef.close(unit); // Cierra el diálogo y pasa los datos actualizados

                    // Mostrar SweetAlert de éxito
                    Swal.fire({
                        title: 'Éxito!',
                        text: 'La unidad ha sido actualizada correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                },
                (error) => {
                    console.error('Error al actualizar la unidad:', error); // Manejo de errores
                    Swal.fire({
                        title: 'Error!',
                        text: 'No se pudo actualizar la unidad. Intenta nuevamente.',
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
