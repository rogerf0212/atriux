import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { User } from '../../../../interfaces/user.interfaces';
import { UserService } from '../../../../services/user.service';

@Component({
    templateUrl: './add-warehouse-dialog.component.html',
    styleUrls: ['./add-warehouse-dialog.component.css'],
    standalone: false
})
export class AddWarehouseDialogComponent implements OnInit {
  public description: string = '';
  public salesOrganizationId: number | null = null;
  public supervisorId: number | null = null;
  public salesOrganizations: any[] = [];
  public users: User[] = [];

  private apiUrl = 'http://137.184.57.180:3000/api/warehouses/insert';
  private salesOrgsUrl = 'http://137.184.57.180:3000/api/salesorganizations';

  constructor(
    public dialogRef: MatDialogRef<AddWarehouseDialogComponent>,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getSalesOrganizations();
    this.getUsers();
  }

  getSalesOrganizations(): void {
    this.http.get<any[]>(this.salesOrgsUrl).subscribe(
      salesOrganizations => {
        this.salesOrganizations = salesOrganizations;
        console.log('Sales Organizations:', this.salesOrganizations); // Verificación de datos
      },
      error => {
        console.error('Error al obtener organizaciones de ventas:', error);
        Swal.fire('Error!', 'No se pudieron obtener las organizaciones de ventas.', 'error');
      }
    );
  }

  getUsers(): void {
    this.userService.getUser().subscribe(
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
        description: this.description,
        sales_organization_id: this.salesOrganizationId,
        supervisor: this.supervisorId
      };

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(this.apiUrl, JSON.stringify(warehouse), { headers }).subscribe(
        response => {
          console.log('Warehouse added:', response);
          this.dialogRef.close(response);
          Swal.fire('Éxito!', 'El almacén ha sido agregado correctamente.', 'success');
        },
        error => {
          console.error('Error al agregar warehouse:', error);
          Swal.fire('Error!', 'No se pudo agregar el almacén. Intenta nuevamente.', 'error');
        }
      );
    } else {
      Swal.fire('Advertencia', 'Por favor, complete todos los campos.', 'warning');
    }
  }
}
