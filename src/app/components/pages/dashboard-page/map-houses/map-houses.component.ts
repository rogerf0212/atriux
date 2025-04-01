import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from '../../users/dialogs/add-user/add-user.component';
import { EditUserComponent } from '../../users/dialogs/edit-user/edit-user.component';
import { DeleteUserComponent } from '../../users/dialogs/delete-user/delete-user.component';

@Component({
    templateUrl: './map-houses.component.html',
    styles: ``,
    standalone: false
})
export class MapHousesComponent implements OnInit {

  public users: User[] = []; // Almacena la lista de usuarios

  constructor(private router: Router, private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers(); // Cargar usuarios al iniciar
  }

  loadUsers(): void {
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

  navigateToDashboard(): void {
    this.router.navigate(['/mapa']); // Esto debería funcionar
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Usuario agregado:', result);
        this.loadUsers(); // Actualizar la lista de usuarios después de agregar uno nuevo
      }
    });
  }

  openEditUserDialog(user: User): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Usuario actualizado:', result);
        this.loadUsers(); // Actualizar la lista de usuarios después de editar uno
      }
    });
  }

  onDeleteUser(user: User): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: user // Pasa el usuario a eliminar al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Si el usuario confirma la eliminación
        if (user.id) { // Verifica que user.id esté definido
          this.userService.deleteUserById(user.id.toString()).subscribe(success => {
            if (success) {
              console.log('Usuario eliminado exitosamente');
              this.loadUsers(); // Actualizar la lista de usuarios después de eliminar uno
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
}
