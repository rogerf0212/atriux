import { Component, OnInit, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/pages/services/auth.services';
import { AuthStatus } from './auth/interfaces';
import { TypeAccountService } from './components/pages/clients/servicios-clientes/type-account/type-account.component';
import { PaymentTypeService } from './components/pages/clients/servicios-clientes/payment-type/payment-type.component';
import { PaymentTermService } from './components/pages/clients/servicios-clientes/paymet-terms/paymet-terms.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'] // Asegúrate de usar 'styleUrls' en plural
    ,
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'dashboard-atriux';

  constructor(
    private typeAccountService: TypeAccountService,
    private paymentTypeService: PaymentTypeService,
    private paymentTermService: PaymentTermService // Inyecta el servicio
  ) {}

  ngOnInit() {
    this.typeAccountService.checkAndStoreTypesOfAccounts(); // Llama al servicio para almacenar tipos de cuenta
    this.paymentTypeService.checkAndStorePaymentTypes(); // Llama al servicio para almacenar tipos de pago
    this.paymentTermService.checkAndStorePaymentTerms(); // Llama al servicio para almacenar términos de pago
  }
}
