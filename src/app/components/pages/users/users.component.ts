import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interfaces';
import { AddUserComponent } from './dialogs/add-user/add-user.component';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from './dialogs/edit-user/edit-user.component';
import { ChangeDetectorRef } from '@angular/core';
import { DeleteUserComponent } from './dialogs/delete-user/delete-user.component';
import { ClienteUsuarioDialogComponent } from './dialogs/dialogs/cliente-usuario-dialog/cliente-usuario-dialog.component';


@Component({
    templateUrl: './users.component.html',
    styles: ``,
    styleUrl: './users.component.css',
    standalone: false,
})
export class UsersComponent {

  public users: User[] = []; // Almacena la lista de usuarios
  public selectedUser?: User; // Almacena el usuario seleccionado
  isOpen = false; // Estado del offcanvas

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers(); // Cargar usuarios al iniciar
  }

  loadUsers() {
    this.userService.getUser().subscribe(
      (data) => {
        this.users = data; // Almacena los usuarios obtenidos
        console.log(data);
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  toggleOffcanvas(user?: User) {
    this.selectedUser = user; // Asigna el usuario seleccionado
    this.isOpen = !this.isOpen; // Cambia el estado al hacer clic
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '400px',
      data: {}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Usuario agregado:', result);
        this.users.push(result); // Agregar el nuevo usuario a la lista
      }
    });
  }

  openEditUserDialog(user: User) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: user
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Usuario actualizado:', result);
        const index = this.users.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.users[index] = result; // Actualiza el usuario en la lista
        }
      }
    });
  }

  onDeleteUser(role: User) {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: role // Pasa el rol a eliminar al diálogo
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Si el usuario confirma la eliminación
        if (role.id) { // Verifica que role.id esté definido
          this.userService.deleteUserById(role.id.toString()).subscribe(success => {
            if (success) {
              console.log('Usuario eliminado exitosamente');
              // Actualiza la lista de roles
              this.users = this.users.filter(r => r.id !== role.id);
            } else {
              console.error('Error al eliminar el usuario');
            }
          });
        } else {
          console.error('ID del usuario no está definido');
        }
      }
    });
  }

  // Agregar el nuevo método para manejar el clic en el botón "Clientes"
  handleClientsClick() {
    console.log('Presionaste el botón Cliente');
    if (this.selectedUser) {
      this.dialog.open(ClienteUsuarioDialogComponent, {
        width: '400px',
        data: { userId: this.selectedUser.id }
      });
    }
  }

}
