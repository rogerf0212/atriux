import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from '../../../servicios/services/client.service';

@Component({
  standalone: true,
  selector: 'app-cliente-usuario-dialog',
  templateUrl: './cliente-usuario-dialog.component.html',
  styleUrls: ['./cliente-usuario-dialog.component.css'],
  imports: [MatDialogModule, MatCheckboxModule, CommonModule, FormsModule] // Importar módulos necesarios
})
export class ClienteUsuarioDialogComponent implements OnInit {
  public clients: any[] = []; // Almacena la lista de clientes

  constructor(
    public dialogRef: MatDialogRef<ClienteUsuarioDialogComponent>,
    private clientService: ClientService,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number } // Inyectar datos del diálogo
  ) {}

  ngOnInit(): void {
    this.loadClients(); // Cargar clientes al iniciar
  }

  loadClients() {
    this.clientService.getClients().subscribe(
      (data) => {
        this.clients = data; // Almacena los clientes obtenidos
        console.log(data);
      },
      (error) => {
        console.error('Error al cargar clientes:', error);
      }
    );
  }

  onSend(): void {
    const selectedClients = this.clients.filter(client => client.selected);
    const userId = this.data.userId;
    
    selectedClients.forEach(client => {
      const requestBody = {
        user_id: userId,
        account_id: client.id
      };

      console.log('Enviando datos:', requestBody); // Agregar console.log antes de enviar los datos

      this.http.post('http://137.184.57.180:3000/api/usersaccounts/insert', requestBody).subscribe(
        response => {
          console.log('Cliente asignado:', response);
        },
        error => {
          console.error('Error al asignar cliente:', error);
        }
      );
    });

    this.dialogRef.close();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
