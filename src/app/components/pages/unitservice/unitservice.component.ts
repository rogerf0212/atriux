import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { unitOrganizations } from '../../interfaces/data.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private apiUrl = 'http://tu-api-url.com'; // Asegúrate de reemplazar esta URL con la correcta para tu API

  constructor(private http: HttpClient) {}

  addUnit(unit: unitOrganizations): Observable<unitOrganizations> {
    return this.http.post<unitOrganizations>(`${this.apiUrl}/units`, unit);
  }

  getLastCode(): Observable<string> { // Añadir este método
    return this.http.get<string>(`${this.apiUrl}/units/lastCode`);
  }
}
