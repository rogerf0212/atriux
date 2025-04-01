import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-client-manage',
    templateUrl: './client-manage.component.html',
    styleUrls: ['./client-manage.component.css'],
    standalone: false
})
export class ClientManageComponent implements OnInit {
  paymentTypes: any[] = [
    { id: 1, description: 'Tarjeta' },
    { id: 2, description: 'Cheque' },
    { id: 3, description: 'Transferencia' },
    { id: 4, description: 'Efectivo' },
    { id: 5, description: 'Tarjeta de Crédito' }
  ];
  paymentTerms: any[] = [
    { id: 1, description: '30 Días' },
    { id: 2, description: '60 Días' },
    { id: 3, description: '90 Días' },
    { id: 4, description: '120 Días' }
  ];
  @Input() clientId!: number;
  selectedPaymentType: string = '';
  selectedPaymentTerm: string = '';
  organizationalEntities: string = ''; // Por ahora no hace nada

  activePaymentTypes: string = '';
  activePaymentTerms: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadPaymentTypes();
    this.loadPaymentTerms();
    this.loadActivePaymentTypes();
    this.loadActivePaymentTerms();
  }

  loadPaymentTypes() {
    this.http.get('http://137.184.57.180:3000/api/paytype')
      .subscribe((response: any) => {
        this.paymentTypes = response;
      }, error => {
        console.error('Error loading payment types:', error);
      });
  }

  loadPaymentTerms() {
    this.http.get('http://137.184.57.180:3000/api/payterm')
      .subscribe((response: any) => {
        this.paymentTerms = response;
      }, error => {
        console.error('Error loading payment terms:', error);
      });
  }

  loadActivePaymentTypes() {
    this.http.get(`http://137.184.57.180:3000/api/accountpaytype/show_account_id/${this.clientId}`)
      .subscribe((response: any) => {
        this.activePaymentTypes = response.map((type: any) => {
          const paymentType = this.paymentTypes.find(pt => pt.id === type.pay_type_id);
          return paymentType ? paymentType.description : 'Desconocido';
        }).join(', ');
      }, error => {
        console.error('Error loading active payment types:', error);
      });
  }

  loadActivePaymentTerms() {
    this.http.get(`http://137.184.57.180:3000/api/accountpayterm/show_account_id/${this.clientId}`)
      .subscribe((response: any) => {
        this.activePaymentTerms = response.map((term: any) => {
          const paymentTerm = this.paymentTerms.find(pt => pt.id === term.pay_term_id);
          return paymentTerm ? paymentTerm.description : 'Desconocido';
        }).join(', ');
      }, error => {
        console.error('Error loading active payment terms:', error);
      });
  }

  applyChanges() {
    const selectedType = this.paymentTypes.find(type => type.description === this.selectedPaymentType);
    const selectedTerm = this.paymentTerms.find(term => term.description === this.selectedPaymentTerm);

    const payloadPayType = {
      account_id: this.clientId,
      pay_type_id: selectedType ? selectedType.id : null
    };

    const payloadPayTerm = {
      account_id: this.clientId,
      pay_term_id: selectedTerm ? selectedTerm.id : null
    };

    console.log('selectedPaymentType:', this.selectedPaymentType);
    console.log('payTypeId:', payloadPayType.pay_type_id);
    console.log('Payload Pay Type to send:', payloadPayType);
    console.log('Payload Pay Term to send:', payloadPayTerm);

    // Guardar en local storage
    const currentDataPayType = JSON.parse(localStorage.getItem('clientPaymentTypes') || '[]');
    currentDataPayType.push(payloadPayType);
    localStorage.setItem('clientPaymentTypes', JSON.stringify(currentDataPayType));

    const currentDataPayTerm = JSON.parse(localStorage.getItem('clientPaymentTerms') || '[]');
    currentDataPayTerm.push(payloadPayTerm);
    localStorage.setItem('clientPaymentTerms', JSON.stringify(currentDataPayTerm));

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post('http://137.184.57.180:3000/api/accountpaytype/insert', JSON.stringify(payloadPayType), { headers })
      .subscribe(response => {
        console.log('Pay Type Changes applied:', response);
        this.clearFields();
        this.refreshPage();
      }, error => {
        console.error('Error applying pay type changes:', error);
      });

    this.http.post('http://137.184.57.180:3000/api/accountpayterm/insert', JSON.stringify(payloadPayTerm), { headers })
      .subscribe(response => {
        console.log('Pay Term Changes applied:', response);
        this.clearFields();
        this.refreshPage();
      }, error => {
        console.error('Error applying pay term changes:', error);
      });
  }

  clearFields() {
    this.selectedPaymentType = '';
    this.selectedPaymentTerm = '';
  }

  refreshPage() {
    this.loadActivePaymentTypes();
    this.loadActivePaymentTerms();
  }

  closeManage() {
    // Lógica para cerrar la ventana de administración
  }
}
