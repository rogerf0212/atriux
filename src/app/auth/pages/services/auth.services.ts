import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user.interface';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthStatus, LoginResponse } from '../../interfaces';
import { environments } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private loadingSubject = new BehaviorSubject<boolean>(true); // Estado de carga
  public loading$ = this.loadingSubject.asObservable(); // Observable para el estado de carga

  private baseUrl = environments.baseUrl; 
  private readonly USER_KEY = 'currentUser'; // Clave para almacenar el usuario en localStorage

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  private user?: User; // Propiedad para almacenar el usuario actual

  // Computed properties para acceder al usuario actual y al estado de autenticación
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  private userPermissions: any; // Propiedad para almacenar los permisos

  // Método para establecer los permisos
  setPermissions(permissions: any) {
    this.userPermissions = permissions;
  }

  // Método para obtener los permisos
  getPermissions() {
    return this.userPermissions;
  }

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromStorage(); // Cargar el usuario desde localStorage al iniciar
  }

  login(Username: string, Password: string): Observable<boolean> {
    const url = `${this.baseUrl}/api/login`; 
    const body = { Username, Password }; 

    return this.http.post<LoginResponse>(url, body).pipe(
        tap((response) => {
            const { resultado, data_user, permissions } = response; 
            console.log('Respuesta del servidor:', response);

            if (resultado === 1 && data_user.length > 0) {
                const user = data_user[0]; // Obtener el usuario del array
                this.saveUserToStorage(user); // Guardar el usuario en localStorage
                this._currentUser.set(user); // Establecer el usuario actual
                this.user = user; // Asignar el usuario a la propiedad user
                
                if (permissions && Array.isArray(permissions)) {
                    console.log('Permisos recibidos:', permissions); // Agrega este log
                    this.setPermissions(permissions); // Almacenar permisos
                } else {
                    console.error('Permisos no disponibles o mal formateados:', permissions);
                }
                
                this._authStatus.set(AuthStatus.authenticated); // Cambiar el estado a autenticado
            } else {
                throw new Error('User or password incorrect');
            }
        }),
        map(() => true), 
        catchError((err) => {
            const errorMessage = err.error?.message || 'Error desconocido';
            return throwError(() => new Error(errorMessage));
        })
    );
}
  
  logout() {
    this.removeUserFromStorage(); // Eliminar el usuario del localStorage
    this._currentUser.set(null); // Limpiar el usuario actual
    this.user = undefined; // Limpiar la propiedad user
    this._authStatus.set(AuthStatus.notAuthenticated); // Cambiar el estado a no autenticado
  }

  // Método para guardar el usuario en localStorage
  private saveUserToStorage(user: User) {
    if (isPlatformBrowser(this.platformId)) {
        const userWithPermissions = {
            ...user,
            permissions: this.userPermissions 
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(userWithPermissions)); // Guardar el usuario en localStorage
    }
  }

  // Método para cargar el usuario desde localStorage
  private loadUserFromStorage() {
    this.loadingSubject.next(true);
    if (isPlatformBrowser(this.platformId)) {
        const userJson = localStorage.getItem(this.USER_KEY);
        if (userJson) {
            const user = JSON.parse(userJson);
            this._currentUser.set(user);
            this.user = user;
            this._authStatus.set(AuthStatus.authenticated);
            
            // Verificar si los permisos están disponibles en el objeto user
            if (user.permissions) {
                console.log('Permisos cargados desde localStorage:', user.permissions); 
                this.setPermissions(user.permissions); // Cargar permisos desde el usuario
            } else {
                console.error('No se encontraron permisos en el usuario cargado.');
            }
        } else {
            this._authStatus.set(AuthStatus.notAuthenticated);
        }
    } else {
        this._authStatus.set(AuthStatus.notAuthenticated);
    }
    this.loadingSubject.next(false);
  }

  // Método para eliminar el usuario del localStorage
  private removeUserFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.USER_KEY); // Eliminar el usuario del localStorage
    }
  }

  // Método para obtener el usuario actual
  public getCurrentUser(): User | null {
    return this._currentUser();
  }

  setData(data: any[]) {
    localStorage.setItem('myData', JSON.stringify(data));
  }
  
  getData(): any[] {
    const data = localStorage.getItem('myData');
    return data ? JSON.parse(data) : [];
  }
}
