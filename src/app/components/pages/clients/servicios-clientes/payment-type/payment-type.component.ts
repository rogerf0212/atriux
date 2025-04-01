import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentTypeService {
  paymentTypes: { description: string }[] = [
    { description: 'Cheque' },
    { description: 'Transferencia' },
    { description: 'Efectivo' },
    { description: 'Tarjeta de Crédito' }
  ];

  constructor(private http: HttpClient) {}

  checkAndStorePaymentTypes() {
    this.http.get('http://137.184.57.180:3000/api/paytype')
      .subscribe((existingTypes: any) => {
        const existingDescriptions = existingTypes.map((type: any) => type.description);

        this.paymentTypes.forEach((type) => {
          if (!existingDescriptions.includes(type.description)) {
            const payload = {
              description: type.description
            };

            const headers = new HttpHeaders().set('Content-Type', 'application/json');
            this.http.post('http://137.184.57.180:3000/api/paytype/insert', JSON.stringify(payload), { headers })
              .subscribe(response => {
                console.log('Tipo de pago almacenado:', response);
                this.storeInLocalStorage();
              }, error => {
                console.error('Error almacenando tipo de pago:', error);
              });
          } else {
            this.storeInLocalStorage();
          }
        });
      }, error => {
        console.error('Error checking existing payment types:', error);
      });
  }

  storeInLocalStorage() {
    localStorage.setItem('paymentTypes', JSON.stringify(this.paymentTypes));
    console.log('Tipos de pago almacenados en el local storage.');
  }
}
