import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import Swal from 'sweetalert2';
import { User } from '../../../../interfaces/user.interfaces';
import { UserService } from '../../../../services/user.service';
import { Role } from '../../../../interfaces/roles.interfaces';
import { RolesService } from '../../../../services/roles.service';

@Component({
    templateUrl: './edit-user.component.html',
    styles: ``,
    standalone: false
})
export class EditUserComponent implements OnInit {
  public userForm: FormGroup;

  public roles: Role[] = []; // Array para almacenar los roles

  
    get currentUser(): User {
      return {
        // Code: this.rolForm.value.Code || '',
        description: this.userForm.value.description || '',
        first_name: this.userForm.value.first_name || '',
        last_name: this.userForm.value.last_name || '',
        email: this.userForm.value.email || '',
        phone: this.userForm.value.phone || '',
        username: this.userForm.value.username || '',
        password: this.userForm.value.password || '',
        roles_id: this.userForm.value.roles_id || '',
        
        
      };
    }

    constructor(
      private userService: UserService,
      private rolesService: RolesService, 
      public dialogRef: MatDialogRef<EditUserComponent>,
      @Inject(MAT_DIALOG_DATA) public data: User // Recibe los datos de la unidad
    ) {
      // Inicializa el formulario aquí
      this.userForm = new FormGroup({
          id: new FormControl(this.data.id), // Asegúrate de incluir el ID
          // Code: new FormControl(this.data.Code),
          description: new FormControl(this.data.description),
          first_name: new FormControl(this.data.first_name),
          last_name: new FormControl(this.data.last_name),
          email: new FormControl(this.data.email),
          phone: new FormControl(this.data.phone),
          username: new FormControl(this.data.username),
          password: new FormControl(this.data.password), 
          roles_id: new FormControl(this.data.roles_id)
      });
    }

    ngOnInit() {
      this.loadRoles(); // Cargar los roles al inicializar el componente
    }
  
    loadRoles() {
      this.rolesService.getRoles().subscribe(
        (roles) => {
          this.roles = roles; // Almacenar los roles en la variable
        },
        (error) => {
          console.error('Error al cargar los roles:', error);
        }
      );
    }

    closeDialog() {
      this.dialogRef.close(); // Cierra el diálogo
    }
    
    
    onSubmit() {
      if (this.userForm.valid) {
          const currentUser = this.userForm.value as User; // Obtiene el valor del formulario
          console.log('Rol a actualizar:', currentUser); // Verifica que el ID esté presente
    
          if (currentUser.id) { // Verifica que el ID esté presente
              this.userService.UpdateUser(currentUser).subscribe(
                  (unit) => {
                      console.log('User actualizado:', unit);
                      this.dialogRef.close(unit); // Cierra el diálogo y pasa los datos actualizados
    
                      // Mostrar SweetAlert de éxito
                      Swal.fire({
                          title: 'Éxito!',
                          text: 'El Usuario ha sido actualizada correctamente.',
                          icon: 'success',
                          confirmButtonText: 'Aceptar'
                      });
                  },
                  (error) => {
                      console.error('Error al actualizar al usuario:', error); // Manejo de errores
                      Swal.fire({
                          title: 'Error!',
                          text: 'No se pudo actualizar el usuario. Intenta nuevamente.',
                          icon: 'error',
                          confirmButtonText: 'Aceptar'
                      });
                  }
              );
          } else {
              console.error('No se puede actualizar, ID de usuario no válido');
          }
      } else {
          console.error('Formulario inválido');
      }
    }
    

    public hidePassword: boolean = true; // Controla la visibilidad de la contraseña

    togglePasswordVisibility() {
      this.hidePassword = !this.hidePassword; // Cambia el estado de visibilidad
    }

}
