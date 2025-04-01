import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environments } from '../../../environments/environment';
import { NewRole, Role, RolePermissionModule, RolePermissions } from '../interfaces/roles.interfaces';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private basUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {}

  getPermisos(): Observable<RolePermissions[]> {
    return this.http.get<RolePermissions[]>(`${this.basUrl}/api/permissions`);
  }

  getPermisoById(id: string): Observable<RolePermissions[]> {
    return this.http.get<RolePermissions[]>(`${this.basUrl}/api/permissions/show_id/${id}`)
      .pipe(
        catchError(error => of([])) // Cambia a un array vacío si hay un error
      );
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.basUrl}/api/roles`);
  }

  addRol(rol: NewRole): Observable<Role> {
    return this.http.post<Role>(`${this.basUrl}/api/roles/insert`, rol);
  }

  updateRol(rol: NewRole): Observable<NewRole> {
    if (!rol.id) throw Error('Unidad id is required');
    return this.http.post<NewRole>(`${this.basUrl}/api/roles/update`, rol);
  }

  deleteRolById(id: string): Observable<boolean> {
    return this.http.delete(`${this.basUrl}/api/roles/delete/${id}`)
      .pipe(
        map(resp => true),
        catchError(err => of(false)),
      );
  }

  updatePermisos(permiso: any): Observable<any> {
    return this.http.post<any>(`${this.basUrl}/api/permissions/update`, permiso);
  }

  addPermisos(permiso: any): Observable<any> {
    return this.http.post<any>(`${this.basUrl}/api/permissions/insert`, permiso);
  }
}
