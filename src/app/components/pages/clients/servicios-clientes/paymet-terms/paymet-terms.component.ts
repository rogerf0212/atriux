import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentTermService {
  paymentTerms: { description: string, dias: number }[] = [
    { description: '30 Días', dias: 30 },
    { description: '2 meses', dias: 60 },
    { description: '3 meses', dias: 90 },
    { description: '6 meses', dias: 180 }
  ];

  constructor(private http: HttpClient) {}

  checkAndStorePaymentTerms() {
    this.http.get('http://137.184.57.180:3000/api/payterm')
      .subscribe((existingTerms: any) => {
        const existingDescriptions = existingTerms.map((term: any) => term.description);

        this.paymentTerms.forEach((term) => {
          if (!existingDescriptions.includes(term.description)) {
            const payload = {
              description: term.description,
              dias: term.dias
            };

            const headers = new HttpHeaders().set('Content-Type', 'application/json');
            this.http.post('http://137.184.57.180:3000/api/payterm/insert', JSON.stringify(payload), { headers })
              .subscribe(response => {
                console.log('Término de pago almacenado:', response);
                this.storeInLocalStorage();
              }, error => {
                console.error('Error almacenando término de pago:', error);
              });
          } else {
            this.storeInLocalStorage();
          }
        });
      }, error => {
        console.error('Error checking existing payment terms:', error);
      });
  }

  storeInLocalStorage() {
    localStorage.setItem('paymentTerms', JSON.stringify(this.paymentTerms));
    console.log('Términos de pago almacenados en el local storage.');
  }
}
