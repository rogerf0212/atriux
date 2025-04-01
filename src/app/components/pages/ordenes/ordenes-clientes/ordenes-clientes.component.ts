import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-ordenes-clientes',
    templateUrl: './ordenes-clientes.component.html',
    styleUrls: ['./ordenes-clientes.component.css'],
    standalone: false
})
export class OrdenesClientesComponent implements OnInit {
  clientId: string = '';
  clientDescription: string = '';
  orders: any[] = [];
  orderHeaders: any = {
    pay_term_id: null,
    pay_type_id: null,
    order_type: 'OR',
    account_id: '', // El ID del cliente se asigna después en ngOnInit
    seller_id: null,
    delivery_id: null,
    warehouse_id: null,
    verified_by_id: null, // Inicialmente en blanco
    date_verified: '', // Inicialmente en blanco
    date_delivery: '', // Inicialmente en blanco
    date_order: new Date().toISOString().split('T')[0], // Fecha actual del sistema
    status: 'invoiced',
  };
  orderDetails: any[] = [];
  payTerms: any[] = [];
  payTermDescriptions: any[] = [];
  payTypes: any[] = [];
  payTypeDescriptions: any[] = [];
  users: any[] = [];
  deliveryPersons: any[] = [];
  warehouses: any[] = [];
  products: any[] = [];
  warehouseProducts: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  selectedProducts: any[] = [];

  private clientApiUrl = 'http://137.184.57.180:3000/api/accounts/show_id/';
  private ordersApiUrl = 'http://137.184.57.180:3000/api/ordersheader';
  private insertOrderApiUrl = 'http://137.184.57.180:3000/api/orders/insert';
  private deleteOrderApiUrl = 'http://137.184.57.180:3000/api/orders/delete';
  private payTermsApiUrl = `http://137.184.57.180:3000/api/accountpayterm/show_account_id/`;
  private payTermDescriptionsApiUrl = 'http://137.184.57.180:3000/api/payterm';
  private payTypesApiUrl = `http://137.184.57.180:3000/api/accountpaytype/show_account_id/`;
  private payTypeDescriptionsApiUrl = 'http://137.184.57.180:3000/api/paytype';
  private warehousesApiUrl = 'http://137.184.57.180:3000/api/warehouses';
  private warehouseStockUrl =
    'http://137.184.57.180:3000/api/warehousestock/show_warehouses_id';
  private productsUrl = 'http://137.184.57.180:3000/api/products';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id')!;
    this.orderHeaders.account_id = this.clientId; // Asignar clientId a orderHeaders
    this.fetchClientDescription();
    this.fetchClientOrders();
    this.fetchPayTerms();
    this.fetchPayTypes();
    this.fetchUsers(); // Cargar usuarios una vez
    this.fetchWarehouses();
    this.loadProducts();
  }

  fetchClientDescription(): void {
    this.http.get<any>(`${this.clientApiUrl}${this.clientId}`).subscribe(
      (data) => {
        this.clientDescription = data.description;
      },
      (error) => {
        console.error('Error fetching client description:', error);
      }
    );
  }

  fetchClientOrders(): void {
    this.http.get<any>(this.ordersApiUrl).subscribe(
      (data) => {
        this.orders = data.filter(
          (order: any) => order.account_id === parseInt(this.clientId)
        );
        this.populateOrderDetails();
      },
      (error) => {
        console.error('Error fetching client orders:', error);
      }
    );
  }

  populateOrderDetails(): void {
    this.orders.forEach((order) => {
      const seller = this.users.find((user) => user.id === order.seller_id);
      order.seller_description = seller ? seller.description : 'Desconocido';
    });
  }

  navigateToOrderDetails(orderId: number): void {
    this.router.navigate(['/ordenes-detalle', orderId]);
  }

  fetchPayTerms(): void {
    this.http.get<any[]>(`${this.payTermsApiUrl}${this.clientId}`).subscribe(
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
        this.payTermDescriptions = descriptions.filter((description) =>
          this.payTerms.some((term) => term.pay_term_id === description.id)
        );
      },
      (error) => {
        console.error('Error fetching pay term descriptions:', error);
      }
    );
  }

  fetchPayTypes(): void {
    this.http.get<any[]>(`${this.payTypesApiUrl}${this.clientId}`).subscribe(
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
        this.payTypeDescriptions = descriptions.filter((description) =>
          this.payTypes.some((type) => type.pay_type_id === description.id)
        );
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
        this.deliveryPersons = users; // Suponemos que los repartidores también están en los usuarios
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchWarehouses(): void {
    this.http.get<any[]>(this.warehousesApiUrl).subscribe(
      (warehouses) => {
        this.warehouses = warehouses;
      },
      (error) => {
        console.error('Error fetching warehouses:', error);
      }
    );
  }

  loadProducts(): void {
    this.http.get<any[]>(this.productsUrl).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  filterProducts(): void {
    if (!this.orderHeaders.warehouse_id) return;

    this.http
      .get<any[]>(`${this.warehouseStockUrl}/${this.orderHeaders.warehouse_id}`)
      .subscribe(
        (data) => {
          this.warehouseProducts = data.map((product) => {
            const matchingProduct = this.products.find(
              (p) => p.id === product.product_id
            );
            return {
              ...product,
              product_description: matchingProduct
                ? matchingProduct.description
                : 'Descripción no encontrada',
            };
          });
          this.filteredProducts = this.warehouseProducts.filter((product) =>
            product.product_description
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())
          );
        },
        (error) => {
          console.error('Error filtering products:', error);
        }
      );
  }

  selectProduct(product: any): void {
    const quantity = prompt('Ingrese la cantidad:');
    if (quantity !== null && !isNaN(Number(quantity))) {
      const selectedProduct = this.products.find(
        (p) => p.id === product.product_id
      );
      if (selectedProduct) {
        this.selectedProducts.push({
          ...selectedProduct,
          quantity: Number(quantity),
        });
      }
    }
  }

  createOrder(): void {
    const orderPayload = {
      headers: {
        pay_term_id: this.orderHeaders.pay_term_id,
        pay_type_id: this.orderHeaders.pay_type_id,
        order_type: this.orderHeaders.order_type,
        account_id: this.orderHeaders.account_id,
        seller_id: this.orderHeaders.seller_id,
        delivery_id: this.orderHeaders.delivery_id,
        verified_by_id: this.orderHeaders.verified_by_id,
        date_order: this.orderHeaders.date_order,
        date_verified: this.orderHeaders.date_verified,
        date_delivery: this.orderHeaders.date_delivery,
        status: this.orderHeaders.status,
      },
      details: this.selectedProducts.map((product) => ({
        product_id: product.id,
        quantity: product.quantity,
        cost: product.costo,
        taxes: product.taxes,
      })),
    };

    console.log('Order payload:', orderPayload); // Verificar el payload en la consola

    this.http.post(this.insertOrderApiUrl, orderPayload).subscribe(
      (response) => {
        console.log('Order created:', response);
        this.fetchClientOrders(); // Refrescar la lista de órdenes después de crear una nueva orden
        this.selectedProducts = []; // Limpiar la lista de productos seleccionados
      },
      (error) => {
        console.error('Error creating order:', error);
      }
    );
  }

  deleteOrder(orderId: number): void {
    this.http.delete(`${this.deleteOrderApiUrl}/${orderId}`).subscribe(
      (response) => {
        console.log('Order deleted:', response);
        this.fetchClientOrders(); // Refrescar la lista de órdenes después de eliminar una orden
      },
      (error) => {
        console.error('Error deleting order:', error);
      }
    );
  }

  getSellerDescription(sellerId: number): string {
    const seller = this.users.find((user) => user.id === sellerId);
    return seller ? seller.description : 'ID desconocido';
  }

  getDeliveryDescription(deliveryId: number): string {
    const deliveryPerson = this.deliveryPersons.find(
      (deliveryPerson) => deliveryPerson.id === deliveryId
    );
    return deliveryPerson ? deliveryPerson.description : 'ID desconocido';
  }
}
