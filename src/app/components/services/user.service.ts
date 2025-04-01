import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environments } from '../../../environments/environment';
import { User } from '../interfaces/user.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private basUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.basUrl}/api/users`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.basUrl}/api/users/insert`, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.basUrl}/api/users/update`, user);
  }

  deleteUserById(id: string): Observable<boolean> {
    return this.http.delete(`${this.basUrl}/api/users/delete/${id}`)
      .pipe(
        map(resp => true),
        catchError(err => of(false)),
      );
  }

  getUserClients(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.basUrl}/api/usersaccounts/find_user/${userId}`);
  }
}
