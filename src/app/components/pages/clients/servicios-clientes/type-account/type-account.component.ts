import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TypeAccountService {
  typesOfAccounts: { id: number, code: string, description: string }[] = [
    { id: 1, code: '001', description: 'Mayoristas' },
    { id: 2, code: '002', description: 'Proveedores' },
    { id: 3, code: '003', description: 'Comercios' },
    { id: 4, code: '004', description: 'Tiendas' }
  ];

  constructor(private http: HttpClient) {}

  checkAndStoreTypesOfAccounts() {
    this.http.get('http://137.184.57.180:3000/api/typeaccounts')
      .subscribe((existingTypes: any) => {
        const existingDescriptions = existingTypes.map((type: any) => type.description);

        this.typesOfAccounts.forEach((type) => {
          if (!existingDescriptions.includes(type.description)) {
            const payload = {
              id: type.id,
              code: type.code,
              description: type.description
            };

            const headers = new HttpHeaders().set('Content-Type', 'application/json');
            this.http.post('http://137.184.57.180:3000/api/typeaccounts/insert', JSON.stringify(payload), { headers })
              .subscribe(response => {
                console.log('Tipo de cuenta almacenado:', response);
                this.storeInLocalStorage();
              }, error => {
                console.error('Error almacenando tipo de cuenta:', error);
              });
          } else {
            this.storeInLocalStorage();
          }
        });
      }, error => {
        console.error('Error checking existing type accounts:', error);
      });
  }

  storeInLocalStorage() {
    localStorage.setItem('typesOfAccounts', JSON.stringify(this.typesOfAccounts));
    console.log('Tipos de cuenta almacenados en el local storage.');
  }
}
