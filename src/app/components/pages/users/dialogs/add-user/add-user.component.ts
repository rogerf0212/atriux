import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../interfaces/user.interfaces';
import { RolesService } from '../../../../services/roles.service';
import { UserService } from '../../../../services/user.service';

import Swal from 'sweetalert2';
import { Role } from '../../../../interfaces/roles.interfaces';

@Component({
    templateUrl: './add-user.component.html',
    styles: ``,
    standalone: false
})
export class AddUserComponent implements OnInit {

  public roles: Role[] = []; // Array para almacenar los roles

  public userForm = new FormGroup({

    description: new FormControl<string>(''),
    first_name:  new FormControl<string>(''),
    last_name:   new FormControl<string>('', {nonNullable: true }),
    email:       new FormControl(''),
    phone:       new FormControl(''),
    username:    new FormControl(''),
    password:    new FormControl(''),
    roles_id:    new FormControl('')
  
    });


  //   get currentUser(): User {
  //     const user = this.userForm.value as User;
 
  //     return user;
  //  }

  get currentUser(): User {
    return {
      description: this.userForm.value.description ?? '',
      first_name: this.userForm.value.first_name ?? '',
      last_name: this.userForm.value.last_name ?? '',
      email: this.userForm.value.email ?? '',
      phone: this.userForm.value.phone ?? '',
      username: this.userForm.value.username ?? '',
      password: this.userForm.value.password ?? '',
      roles_id: this.userForm.value.roles_id ? Number(this.userForm.value.roles_id) : 0 // Convertir a número
    };
  }



   constructor(
    private userService: UserService,
    private rolesService: RolesService, 
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User // Recibe los datos del usuario
  ) {}

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
    if (this.userForm.invalid) return;

    this.userService.AddUser(this.currentUser).subscribe(
        (unit) => {
            console.log('Usuario agregada:', unit);

            // Mostrar SweetAlert de éxito
            Swal.fire({
                title: 'Éxito!',
                text: 'El usuario ha sido agregada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            this.dialogRef.close(unit); // Cierra el diálogo y pasa los datos
        },
        (error) => {
            console.error('Error al agregar el usuario:', error); // Manejo de errores
            Swal.fire({
                title: 'Error!',
                text: 'No se pudo agregar el usuario. Intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    );
  }

  public hidePassword: boolean = true; // Controla la visibilidad de la contraseña

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword; // Cambia el estado de visibilidad
  }

}
