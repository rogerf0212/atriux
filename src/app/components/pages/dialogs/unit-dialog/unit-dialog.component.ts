import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-unit-dialog',
    templateUrl: './unit-dialog.component.html',
    styleUrls: ['./unit-dialog.component.css'],
    standalone: false
})
export class UnitDialogComponent implements OnInit {
  @Output() unitAdded = new EventEmitter<any>(); // Emitir evento cuando se agregue una unidad
  unitForm: FormGroup;

  private apiUrl = 'http://137.184.57.180:3000/api/unitorganizations/insert';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<UnitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe los datos de la unidad
  ) {
    this.unitForm = this.fb.group({
      Description: ['', Validators.required],
      created_at: [''],
      updated_at: [''],
      deleted_at: [''],
      created_user: [''],
      updated_user: [''],
      deleted_user: ['']
    });
  }

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close(); // Cierra el diálogo
  }

  onSubmit() {
    if (this.unitForm.valid) {
      const unitData = this.unitForm.value;
      const formattedData = {
        description: unitData.Description ? String(unitData.Description) : null,
      };

      if (Object.values(formattedData).some(value => value === null)) {
        console.error('Some form values are null:', formattedData);
        return;
      }

      console.log('Datos formateados:', formattedData); // Verificar los datos formateados antes de enviar

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(this.apiUrl, JSON.stringify(formattedData), { headers })
        .subscribe(response => {
          console.log('Unidad agregada', response);

          // Mostrar SweetAlert de éxito
          Swal.fire({
            title: 'Éxito!',
            text: 'La unidad ha sido agregada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });

          // Emitir evento de unidad agregada
          this.unitAdded.emit(response);

          // Almacenar la unidad en el localStorage
          const units = JSON.parse(localStorage.getItem('units') || '[]');
          units.push(response);
          localStorage.setItem('units', JSON.stringify(units));

          this.dialogRef.close(true); // Indicar que se ha agregado una unidad
        }, error => {
          console.error('Error al agregar la unidad:', error);

          // Manejo de errores
          Swal.fire({
            title: 'Error!',
            text: 'No se pudo agregar la unidad. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        });
    }
  }
}
