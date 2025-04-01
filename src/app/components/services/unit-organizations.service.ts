import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { unitOrganizations } from '../interfaces/data.interfaces';
import { environments } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UnitService {


    private basUrl: string = environments.baseUrl

    constructor(private http: HttpClient) { }



    getUnit():Observable<unitOrganizations[]> {


        return this.http.get<unitOrganizations[]>(`${this.basUrl}/api/unitorganizations`);

    }

    getUnitById( id: string ): Observable<unitOrganizations | undefined> {
        return this.http.get<unitOrganizations>(`${this.basUrl}/api/unitorganizations/show_id/${id}`)
        .pipe(
            catchError( error => of(undefined) )
        );
    }


    addUnit( unit: unitOrganizations ): Observable<unitOrganizations> {

        return this.http.post<unitOrganizations>(`${this.basUrl}/api/unitorganizations/insert`, unit);
    }

    updateUnit( unit: unitOrganizations ): Observable<unitOrganizations> {
        if(!unit.id) throw Error('Unidad id is required')
        return this.http.post<unitOrganizations>(`${this.basUrl}/api/unitorganizations/update`, unit);
    }

    deleteUnitById( id: string ): Observable<boolean> {

        return this.http.delete(`${ this.basUrl }/api/unitorganizations/delete/${id}`)
        // si no da un error no entro en el catch, pero si todo sale bien regreso un true
        .pipe(
            map( resp => true ),
            catchError( err => of(false) ),
          );
    }
    
}