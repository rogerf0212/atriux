import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-ordenes-detalle',
    templateUrl: './ordenes-detalle.component.html',
    styleUrls: ['./ordenes-detalle.component.css'],
    standalone: false
})
export class OrdenesDetalleComponent implements OnInit {

  orderId: number | null = null;
  orderHeader: any = {};
  orderDetails: any[] = [];
  clientDescription: string = '';
  sellerDescription: string = '';

  private orderHeaderApiUrl = 'http://137.184.57.180:3000/api/ordersheader/show_id/';
  private orderDetailsApiUrl = 'http://137.184.57.180:3000/api/ordersdetails/show_by_header/';
  private accountApiUrl = 'http://137.184.57.180:3000/api/accounts/show_id/';
  private productApiUrl = 'http://137.184.57.180:3000/api/products/show_id/';
  private taxApiUrl = 'http://137.184.57.180:3000/api/taxes/show_id/';

  constructor(private route: ActivatedRoute, private http: HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchOrderDetails();
  }

  fetchOrderDetails(): void {
    if (this.orderId) {
      this.http.get<any>(`${this.orderHeaderApiUrl}${this.orderId}`).subscribe(
        data => {
          this.orderHeader = data;
          this.fetchClientDescription(this.orderHeader.account_id);
          this.fetchSellerDescription(this.orderHeader.seller_id);
          this.fetchOrderProducts();
        },
        error => {
          console.error('Error fetching order header:', error);
        }
      );
    }
  }

  fetchClientDescription(accountId: number): void {
    this.http.get<any>(`${this.accountApiUrl}${accountId}`).subscribe(
      data => {
        this.clientDescription = data.description;
      },
      error => {
        console.error('Error fetching client description:', error);
      }
    );
  }

  fetchSellerDescription(sellerId: number): void {
    this.userService.getUser().subscribe(
      users => {
        const seller = users.find(user => user.id === sellerId);
        this.sellerDescription = seller ? seller.description : 'Desconocido';
      },
      error => {
        console.error('Error fetching seller description:', error);
      }
    );
  }

  fetchOrderProducts(): void {
    if (this.orderId) {
      this.http.get<any[]>(`${this.orderDetailsApiUrl}${this.orderId}`).subscribe(
        data => {
          this.orderDetails = data;
          this.orderDetails.forEach(product => {
            this.fetchProductDetailsAndCalculateTax(product);
          });
        },
        error => {
          console.error('Error fetching order details:', error);
        }
      );
    }
  }

  fetchProductDetailsAndCalculateTax(product: any): void {
    this.http.get<any>(`${this.productApiUrl}${product.product_id}`).subscribe(
      productData => {
        product.description = productData.description;
        product.cost = productData.costo;
        product.formattedCost = this.formatCurrency(productData.costo);
        const productCost: number = productData.costo;
        this.fetchTaxAndCalculate(product, productData.taxes, productCost);
      },
      error => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  fetchTaxAndCalculate(product: any, taxId: number, productCost: number): void {
    this.http.get<any>(`${this.taxApiUrl}${taxId}`).subscribe(
      taxData => {
        const percentage = taxData.percentage;
        const taxAmount: number = (productCost * percentage) / 100;
        this.calculateAndFormatTax(product, taxAmount);
        product.taxAmount = taxAmount; // Guardar el valor del impuesto como número
      },
      error => {
        console.error('Error fetching tax data:', error);
      }
    );
  }

  calculateAndFormatTax(product: any, taxAmount: number): void {
    product.calculatedTax = this.formatCurrency(taxAmount);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(value);
  }
}
