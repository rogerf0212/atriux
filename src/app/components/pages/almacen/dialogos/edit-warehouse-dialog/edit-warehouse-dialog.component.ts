import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
    templateUrl: './edit-warehouse-dialog.component.html',
    styleUrls: ['./edit-warehouse-dialog.component.css'],
    standalone: false
})
export class EditWarehouseDialogComponent implements OnInit {
  public description: string;
  public salesOrganizationId: number;
  public supervisorId: number;
  public salesOrganizations: any[] = [];
  public users: any[] = [];

  private apiUrl = 'http://137.184.57.180:3000/api/warehouses/update';
  private salesOrgsUrl = 'http://137.184.57.180:3000/api/salesorganizations';
  private usersUrl = 'http://137.184.57.180:3000/api/users';

  constructor(
    public dialogRef: MatDialogRef<EditWarehouseDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.description = data.description;
    this.salesOrganizationId = data.sales_organization_id;
    this.supervisorId = data.supervisor;
  }

  ngOnInit(): void {
    this.getSalesOrganizations();
    this.getUsers();
  }

  getSalesOrganizations(): void {
    this.http.get<any[]>(this.salesOrgsUrl).subscribe(
      salesOrganizations => {
        this.salesOrganizations = salesOrganizations;
        console.log('Sales Organizations:', this.salesOrganizations);
      },
      error => {
        console.error('Error al obtener organizaciones de ventas:', error);
        Swal.fire('Error!', 'No se pudieron obtener las organizaciones de ventas.', 'error');
      }
    );
  }

  getUsers(): void {
    this.http.get<any[]>(this.usersUrl).subscribe(
      users => {
        this.users = users;
        console.log('Usuarios:', this.users);
      },
      error => {
        console.error('Error al obtener usuarios:', error);
        Swal.fire('Error!', 'No se pudieron obtener los usuarios.', 'error');
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.description && this.salesOrganizationId && this.supervisorId) {
      const warehouse = {
        id: this.data.id,
        description: this.description,
        sales_organization_id: this.salesOrganizationId,
        supervisor: this.supervisorId
      };

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(this.apiUrl, JSON.stringify(warehouse), { headers }).subscribe(
        response => {
          console.log('Warehouse updated:', response);
          this.dialogRef.close(response);
          Swal.fire('Éxito!', 'El almacén ha sido actualizado correctamente.', 'success');
        },
        error => {
          console.error('Error al actualizar warehouse:', error);
          Swal.fire('Error!', 'No se pudo actualizar el almacén. Intenta nuevamente.', 'error');
        }
      );
    } else {
      Swal.fire('Advertencia', 'Por favor, complete todos los campos.', 'warning');
    }
  }
}
