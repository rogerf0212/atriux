import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddClientDialogComponent } from '../add-client-dialog/add-client-dialog.component';
import { EditClientDialogComponent } from '../edit-client-dialog-component/edit-client-dialog.component';
import { Router } from '@angular/router';

interface Client {
  description: string;
  phone1: string;
  type_account: number; // Cambiar a number
  id: number;
  rnc_cedula?: string;
}

interface AccountType {
  id: number;
  description: string;
}

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.css'],
    standalone: false
})
export class ClientsComponent implements OnInit, AfterViewInit {
  activeTab = 'tab1';
  isOpen = false; // Estado del offcanvas
  clients: Client[] = []; // Lista de clientes
  filteredClients: Client[] = []; // Lista filtrada de clientes
  paginatedClients: Client[] = []; // Lista paginada de clientes
  dataSource = new MatTableDataSource<Client>(this.filteredClients); // Inicializar el dataSource
  accountTypes: AccountType[] = []; // Lista de tipos de cuenta

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadAccountTypes(); // Cargar tipos de cuenta primero
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.displayClients(); // Initial display with correct pagination
  }

  loadAccountTypes() {
    this.http.get<AccountType[]>('http://137.184.57.180:3000/api/typeaccounts').subscribe(
      (data) => {
        this.accountTypes = data;
        this.loadClients(); // Cargar clientes después de obtener los tipos de cuenta
      },
      (error) => {
        console.error('Error al cargar tipos de cuenta:', error);
      }
    );
  }

  getAccountTypeDescription(typeAccountId: number): string {
    const accountType = this.accountTypes.find(type => type.id === typeAccountId);
    return accountType ? accountType.description : 'Desconocido';
  }

  loadClients() {
    this.clients = []; // Reiniciar la lista de clientes
    const maxID = 100; // Suponiendo que el ID máximo es 100, ajustar según sea necesario

    for (let i = 1; i <= maxID; i++) {
      this.http.get<Client>(`http://137.184.57.180:3000/api/accounts/show_id/${i}`).subscribe(response => {
        if (response && response.description && response.phone1 && response.type_account) { // Filtrar entradas vacías
          this.clients.push(response);
          this.filteredClients = [...this.clients]; // Inicialmente, filteredClients es igual a clients
          console.log('Cliente cargado:', response); // Agregar console.log para validar
          localStorage.setItem('clients', JSON.stringify(this.clients)); // Guardar en localStorage
          this.displayClients(); // Mostrar cliente cargado
        }
      });
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleOffcanvas() {
    this.isOpen = !this.isOpen; // Cambia el estado al hacer clic
  }

  openAddClientDialog() {
    const dialogRef = this.dialog.open(AddClientDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }

  injectCSS() {
    const style = document.createElement('style');
    style.innerHTML = `
      .client-table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        margin: 25px 0;
        font-size: 1em;
        font-family: sans-serif;
        min-width: 450px;
      }
      .table-header {
        background-color: #f3f4f6;
        color: #4b5563;
        text-transform: uppercase;
        font-size: 0.875rem;
        line-height: 1.25rem;
        text-align: middle;
      }
      .header-cell {
        padding: 12px 15px;
      }
      .table-body {
        color: #4b5563;
        font-size: 0.875rem;
        font-weight: 300;
      }
      .table-row {
        border-bottom: 1px solid #dddddd;
      }
      .table-row:nth-of-type(even) {
        background-color: #f3f3f3;
      }
      .table-row:last-of-type {
        border-bottom: 2px solid #009879;
      }
      .body-cell {
        padding: 12px 15px;
      }
      .action-button {
        color: #1e88e5;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        transition: color 0.3s;
      }
      .action-button:hover {
        color: #0d47a1;
      }
      mat-icon {
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
  }

  displayClients() {
    this.injectCSS(); // Inject CSS
    const clients = this.filteredClients.length ? this.filteredClients : this.clients;

    // Paginate clients
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.paginatedClients = clients.slice(startIndex, endIndex);

    this.dataSource.data = this.paginatedClients; // Update the dataSource
  }

  deleteClient(clientId: number) {
    // Eliminar de la base de datos
    this.http.delete(`http://137.184.57.180:3000/api/accounts/delete/${clientId}`).subscribe(response => {
      console.log('Cliente eliminado', response);

      // Eliminar cliente de la lista
      this.clients = this.clients.filter(client => client.id !== clientId);
      this.filteredClients = this.clients;

      // Actualizar localStorage
      localStorage.setItem('clients', JSON.stringify(this.clients));

      // Actualizar la vista
      this.displayClients();
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.filteredClients = this.clients.filter(client => {
      const descriptionMatch = client.description?.toLowerCase().includes(query.toLowerCase());
      const idMatch = client.id.toString().includes(query);
      const rncCedulaMatch = client.rnc_cedula?.toLowerCase().includes(query.toLowerCase());
      const typeAccountMatch = this.getAccountTypeDescription(client.type_account)?.toLowerCase().includes(query.toLowerCase());
      return descriptionMatch || idMatch || rncCedulaMatch || typeAccountMatch;
    });
    this.displayClients();
  }

  viewClient(clientId: number) {
    this.router.navigate(['/pages/clientes-detalle', clientId]);
  }

  blockClient(clientId: number) {
    console.log(`Bloquear cliente con ID: ${clientId}`);
    // Agrega aquí la lógica para bloquear el cliente
  }

  editClient(clientId: number) {
    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      width: '400px',
      data: { clientId } // Pasar el ID del cliente al cuadro de diálogo de edición
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients(); // Recargar la lista de clientes después de editar uno
      }
    });
  }

  onPageChange(event: PageEvent) {
    console.log('Page Event:', event); // Log the event details
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.displayClients(); // Update the view with the new page
  }
}
