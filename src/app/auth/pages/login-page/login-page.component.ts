import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

import { AuthService } from '../services/auth.services';

@Component({
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.css',
    standalone: false
})
export class LoginPageComponent {

  // injectar servicio en funcion
  private fb          = inject( FormBuilder );

  private authService = inject( AuthService);

  private router      = inject(Router);

  public myForm: FormGroup = this.fb.group({
    // Username: ['', [ Validators.required, Validators.email ]],
    Username: ['Test01', [ Validators.required ]],
    // Password: ['', [ Validators.required, Validators.minLength(6) ]] ,
    Password: ['1234', [Validators.required]],
  });


  login() {
    // console.log(this.myForm.value); 
    const {Username, Password} = this.myForm.value;

    this.authService.login(Username, Password)
    .subscribe({
      // next: () => console.log('Inicio de sesión exitoso'),
      next: () => this.router.navigateByUrl('/pages') ,
      error: (message) => {
        // console.error('Error de inicio de sesión:', error.message);
        // Swal.fire('Error', message, 'error')
        Swal.fire('Error', 'Credenciales no Validas', 'error')
      }
    });

  }

}
