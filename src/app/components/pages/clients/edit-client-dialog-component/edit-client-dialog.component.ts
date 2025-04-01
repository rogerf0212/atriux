import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-edit-client-dialog',
    templateUrl: './edit-client-dialog.component.html',
    styleUrls: ['./edit-client-dialog.component.css'],
    standalone: false
})
export class EditClientDialogComponent implements OnInit {
  clientForm: FormGroup;
  clientId: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clientId = data.clientId; // Obtener el ID del cliente
    this.clientForm = this.fb.group({
      description: ['', Validators.required],
      rnc_cedula: ['', Validators.required],
      type_account: ['', Validators.required],
      note: [''],
      country: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      phone1: ['', Validators.required],
      phone2: [''],
      email: ['', [Validators.required, Validators.email]],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
      credit_limit: ['', Validators.required],
      credit_consumed: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Cargar los datos del cliente cuando el componente se inicialice
    this.http.get<any>(`http://137.184.57.180:3000/api/accounts/show_id/${this.clientId}`).subscribe(client => {
      this.clientForm.patchValue(client);
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      const formattedData = {
        description: clientData.description,
        rnc_cedula: clientData.rnc_cedula,
        type_account: clientData.type_account,
        note: clientData.note,
        country: clientData.country,
        city: clientData.city,
        address: clientData.address,
        phone1: clientData.phone1,
        phone2: clientData.phone2,
        email: clientData.email,
        latitud: parseFloat(clientData.latitud),
        longitud: parseFloat(clientData.longitud),
        credit_limit: parseFloat(clientData.credit_limit),
        credit_consumed: parseFloat(clientData.credit_consumed)
      };

      if (Object.values(formattedData).some(value => value === null || value === '')) {
        console.error('Some form values are null:', formattedData);
        return;
      }

      console.log('Formatted Data:', formattedData);

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post('http://137.184.57.180:3000/api/accounts/update', JSON.stringify(formattedData), { headers }).subscribe(response => {
        console.log('Cliente actualizado', response);
        this.updateLocalStorage(formattedData); // Actualizar en localStorage
        this.dialogRef.close(true); // Pasamos true para indicar que se ha actualizado un cliente
      });
    }
  }

  updateLocalStorage(updatedClient: any) {
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const clientIndex = clients.findIndex((client: any) => client.id === this.clientId);
    if (clientIndex !== -1) {
      clients[clientIndex] = updatedClient;
      localStorage.setItem('clients', JSON.stringify(clients));
    }
  }
}
