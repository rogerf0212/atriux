import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-add-unit-dialog',
    templateUrl: './add-unit-dialog.component.html',
    styleUrls: ['./add-unit-dialog.component.css'],
    standalone: false
})
export class AddUnitDialogComponent implements OnInit {
  @Output() unitAdded = new EventEmitter<any>(); // Emitir evento cuando se agregue una unidad
  unitForm: FormGroup;

  private apiUrl = 'http://137.184.57.180:3000/api/salesorganizations/insert';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddUnitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe los datos de la unidad
  ) {
    this.unitForm = this.fb.group({
      Description: ['', Validators.required],
      Unit_Organizations_id: [this.data.unit.id.toString(), Validators.required] // Convertir a string
    });
  }

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close(); // Cierra el diálogo
  }

  onSubmit() {
    if (this.unitForm.valid) {
      const unitData = this.unitForm.value;
      console.log('Datos del formulario:', unitData);

      const formattedData = {
        Description: unitData.Description ? String(unitData.Description) : '',
        Unit_Organization_id: unitData.Unit_Organizations_id
      };

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
          const units = JSON.parse(localStorage.getItem('newUnit') || '[]');
          units.push(response);
          localStorage.setItem('newUnit', JSON.stringify(units));

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
