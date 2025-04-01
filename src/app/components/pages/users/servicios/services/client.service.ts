import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://137.184.57.180:3000/api/accounts';

  constructor(private http: HttpClient) {}

  getClients(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
