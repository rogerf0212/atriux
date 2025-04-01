import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { unitOrganizations } from '../../../interfaces/data.interfaces';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { SalesService } from '../../../services/sales-organizations.service';


@Component({
    templateUrl: './unit-venta-dialog.component.html',
    styles: ``,
    standalone: false
})
export class UnitVentaDialogComponent {

  public unitForm = new FormGroup({
    id: new FormControl<string>(''),
    Code: new FormControl<string>(''),
    Description: new FormControl<string>('', { nonNullable: true }),
    Unit_Organization_id: new FormControl<number>(1), // Establece un valor predeterminado o recíbelo como parámetro
    created_at: new FormControl(''),
    updated_at: new FormControl(''),
    deleted_at: new FormControl(''),
    created_user: new FormControl(''),
    updated_user: new FormControl(''),
    deleted_user: new FormControl(''),
});
  
  
  
    
    get currentUnit(): unitOrganizations {
       const unit = this.unitForm.value as unitOrganizations;
  
       return unit;
    }
  
  
    constructor(
      private SalesService: SalesService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      public dialogRef: MatDialogRef<UnitVentaDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: unitOrganizations // Recibe los datos de la unidad
    ) {}
  
  
    ngOnInit(): void {
  
      
  
    }
  
    closeDialog() {
      this.dialogRef.close(); // Cierra el diálogo
    }
  
    onSubmit() {
      if (this.unitForm.invalid) return;
  
      this.SalesService.addUnit(this.currentUnit).subscribe(
          (unit) => {
              console.log('Unidad agregada:', unit);
  
              // Mostrar SweetAlert de éxito
              Swal.fire({
                  title: 'Éxito!',
                  text: 'La unidad ha sido agregada correctamente.',
                  icon: 'success',
                  confirmButtonText: 'Aceptar'
              });
  
              this.dialogRef.close(unit); // Cierra el diálogo y pasa los datos
          },
          (error) => {
              console.error('Error al agregar la unidad:', error); // Manejo de errores
              Swal.fire({
                  title: 'Error!',
                  text: 'No se pudo agregar la unidad. Intenta nuevamente.',
                  icon: 'error',
                  confirmButtonText: 'Aceptar'
              });
          }
      );
    }
  
    

}
