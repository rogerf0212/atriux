import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';


@Component({
    selector: 'app-create-order-dialog',
    templateUrl: './create-order-dialog.component.html',
    styleUrls: ['./create-order-dialog.component.css'],
    standalone: false
})
export class CreateOrderDialogComponent implements OnInit {

  orderHeaders: any = {
    pay_term_id: null,
    pay_type_id: null,
    order_type: 'OR',
    account_id: this.data.clientId,  // El ID del cliente se hereda
    seller_id: null,
    delivery_id: null,
    verified_by_id: null, // Inicialmente en blanco
    date_verified: '',    // Inicialmente en blanco
    date_delivery: '',    // Inicialmente en blanco
    date_order: '',
    status: 'invoiced'
  };
  orderDetails: any[] = [
    { product_id: 1, quantity: 1 }
  ];
  payTerms: any[] = [];
  payTermDescriptions: any[] = [];
  payTypes: any[] = [];
  payTypeDescriptions: any[] = [];
  users: any[] = [];
  deliveryPersons: any[] = [];

  private insertOrderApiUrl = 'http://137.184.57.180:3000/api/orders/insert';
  private payTermsApiUrl = `http://137.184.57.180:3000/api/accountpayterm/show_account_id/${this.data.clientId}`;
  private payTermDescriptionsApiUrl = 'http://137.184.57.180:3000/api/payterm';
  private payTypesApiUrl = `http://137.184.57.180:3000/api/accountpaytype/show_account_id/${this.data.clientId}`;
  private payTypeDescriptionsApiUrl = 'http://137.184.57.180:3000/api/paytype';

  constructor(
    public dialogRef: MatDialogRef<CreateOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.fetchPayTerms();
    this.fetchPayTypes();
    this.fetchUsers();
    this.fetchDeliveryPersons();
  }

  fetchPayTerms(): void {
    this.http.get<any[]>(this.payTermsApiUrl).subscribe(
      (payTerms) => {
        this.payTerms = payTerms;
        this.fetchPayTermDescriptions();
      },
      (error) => {
        console.error('Error fetching pay terms:', error);
      }
    );
  }

  fetchPayTermDescriptions(): void {
    this.http.get<any[]>(this.payTermDescriptionsApiUrl).subscribe(
      (descriptions) => {
        this.payTermDescriptions = descriptions.filter(description => 
          this.payTerms.some(term => term.pay_term_id === description.id));
      },
      (error) => {
        console.error('Error fetching pay term descriptions:', error);
      }
    );
  }

  fetchPayTypes(): void {
    this.http.get<any[]>(this.payTypesApiUrl).subscribe(
      (payTypes) => {
        this.payTypes = payTypes;
        this.fetchPayTypeDescriptions();
      },
      (error) => {
        console.error('Error fetching pay types:', error);
      }
    );
  }

  fetchPayTypeDescriptions(): void {
    this.http.get<any[]>(this.payTypeDescriptionsApiUrl).subscribe(
      (descriptions) => {
        this.payTypeDescriptions = descriptions.filter(description => 
          this.payTypes.some(type => type.pay_type_id === description.id));
      },
      (error) => {
        console.error('Error fetching pay type descriptions:', error);
      }
    );
  }

  fetchUsers(): void {
    this.userService.getUser().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchDeliveryPersons(): void {
    this.userService.getUser().subscribe(
      (users) => {
        this.deliveryPersons = users; // Suponemos que los repartidores también están en los usuarios
      },
      (error) => {
        console.error('Error fetching delivery persons:', error);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createOrder(): void {
    const orderPayload = {
      headers: this.orderHeaders,
      details: this.orderDetails
    };

    this.http.post(this.insertOrderApiUrl, orderPayload).subscribe(
      response => {
        console.log('Order created:', response);
        this.dialogRef.close('created');
      },
      error => {
        console.error('Error creating order:', error);
      }
    );
  }
}
