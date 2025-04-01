import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { AddWarehouseDialogComponent } from './dialogos/add-warehouse-dialog/add-warehouse-dialog.component';
import { EditWarehouseDialogComponent } from './dialogos/edit-warehouse-dialog/edit-warehouse-dialog.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
    templateUrl: './almacen.component.html',
    styleUrls: ['./almacen.component.css'],
    standalone: false
})
export class AlmacenComponent implements OnInit {
  public warehouses: any[] = [];
  public searchTerm: string = ''; 
  public users: any[] = [];

  private apiUrl = 'http://137.184.57.180:3000/api/warehouses';
  private usersUrl = 'http://137.184.57.180:3000/api/users';
  private salesOrgsUrl = 'http://137.184.57.180:3000/api/salesorganizations';

  constructor(private http: HttpClient, private dialog: MatDialog, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getWarehouses();
    this.getUsers();
  }

  getWarehouses() {
    this.http.get<any[]>(this.apiUrl).subscribe(
      warehouses => {
        console.log('Warehouses recibidos:', warehouses);
        this.warehouses = warehouses;
        this.getSalesOrganizations();
      },
      error => {
        console.error('Error al obtener warehouses:', error);
        this.warehouses = [];
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
        this.users = [];
      }
    );
  }

  getSalesOrganizations(): void {
    this.http.get<any[]>(this.salesOrgsUrl).subscribe(
      salesOrganizations => {
        console.log('Sales Organizations recibidas:', salesOrganizations);
        this.assignDescriptions(salesOrganizations);
      },
      error => {
        console.error('Error al obtener organizaciones de ventas:', error);
      }
    );
  }

  assignDescriptions(salesOrganizations: any[]): void {
    this.warehouses.forEach(warehouse => {
      const user = this.users.find(u => u.id === warehouse.supervisor);
      const salesOrg = salesOrganizations.find(org => org.id === warehouse.sales_organization_id);
      warehouse.supervisorDescription = user ? `${user.first_name} ${user.last_name}` : 'N/A';
      warehouse.salesOrganizationDescription = salesOrg ? salesOrg.Description : 'N/A';
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddWarehouseDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getWarehouses();
      }
    });
  }

  editWarehouse(warehouse: any) {
    const dialogRef = this.dialog.open(EditWarehouseDialogComponent, {
      data: warehouse
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getWarehouses();
      }
    });
  }

  deleteWarehouse(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteUrl = `${this.apiUrl}/delete/${id}`;
        this.http.delete(deleteUrl).subscribe(() => {
          console.log('Warehouse eliminado:', id);
          this.warehouses = this.warehouses.filter(warehouse => warehouse.id !== id);
          Swal.fire('Eliminado!', 'El almacén ha sido eliminado.', 'success');
        }, error => {
          console.error('Error al eliminar warehouse:', error);
          Swal.fire('Error!', 'No se pudo eliminar el almacén. Intenta nuevamente.', 'error');
        });
      }
    });
  }

  filterWarehouses() {
    if (!this.searchTerm) {
      this.getWarehouses();
      return;
    }
    const lowerSearchTerm = this.searchTerm.toLowerCase();
    this.warehouses = this.warehouses.filter(warehouse =>
      warehouse.code?.toLowerCase().includes(lowerSearchTerm) ||
      warehouse.description?.toLowerCase().includes(lowerSearchTerm)
    );
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.warehouses);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Almacenes');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'almacenes.xlsx');
  }
}
