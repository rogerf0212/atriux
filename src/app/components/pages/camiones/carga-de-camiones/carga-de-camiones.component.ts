import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-carga-de-camiones',
    templateUrl: './carga-de-camiones.component.html',
    styleUrls: ['./carga-de-camiones.component.css'],
    standalone: false
})
export class CargaDeCamionesComponent implements OnInit {

  truckId: string = '';
  truckDescription: string = '';
  orders: any[] = [];
  accounts: any[] = [];
  warehouses: any[] = [];
  selectedWarehouseIds: { [key: number]: number } = {}; 

  private ordersApiUrl = 'http://137.184.57.180:3000/api/ordersheader';
  private accountsApiUrl = 'http://137.184.57.180:3000/api/accounts';
  private warehousesApiUrl = 'http://137.184.57.180:3000/api/warehouses';
  private loadsDetailsInsertApiUrl = 'http://137.184.57.180:3000/api/loadsdetails/insert';
  private loadsDetailsApiUrl = 'http://137.184.57.180:3000/api/loadsdetails/show_order_details';
  private ordersUpdateApiUrl = 'http://137.184.57.180:3000/api/ordersheader/update'; 

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.truckId = this.route.snapshot.paramMap.get('id') ?? '';
    this.truckDescription = this.route.snapshot.paramMap.get('description') ?? '';
    this.loadAccounts();
    this.loadWarehouses();
    this.loadPendingOrders();
  }

  loadAccounts(): void {
    this.http.get<any[]>(this.accountsApiUrl).subscribe(
      (data) => {
        this.accounts = data;
      },
      (error) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

  loadWarehouses(): void {
    this.http.get<any[]>(this.warehousesApiUrl).subscribe(
      (data) => {
        this.warehouses = data;
      },
      (error) => {
        console.error('Error fetching warehouses:', error);
      }
    );
  }

  loadPendingOrders(): void {
    this.http.get<any[]>(this.ordersApiUrl).subscribe(
      (data) => {
        this.orders = data.filter(order => order.status === 'Pendiente');
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  getAccountDescription(accountId: number): string {
    const account = this.accounts.find(acc => acc.id === accountId);
    return account ? account.description : 'ID desconocido';
  }

  onWarehouseChange(orderId: number, event: Event): void {
    const warehouseId = (event.target as HTMLSelectElement).value;
    this.selectedWarehouseIds[orderId] = Number(warehouseId);
  }

  agregarCarga(order: any): void {
    if (!this.selectedWarehouseIds[order.id]) {
      console.error('No warehouse selected for order:', order.id);
      return;
    }

    const warehouseId = this.selectedWarehouseIds[order.id];
    const productsUrl = `http://137.184.57.180:3000/api/ordersdetails/show_by_header/${order.id}`;

    console.log('Order data:', order); // Verificar los datos de la orden

    this.http.get<any[]>(productsUrl).subscribe(
      (products) => {
        products.forEach(product => {
          const payload = {
            code_load_trucks: order.code,
            product_id: product.product_id,
            product_quantity_load: product.quantity,
            warehouse_id: warehouseId,
            truck_id: Number(this.truckId),
            delivery_id: order.delivery_id
          };

          console.log('Payload:', payload); // Verificar el payload antes de enviar

          this.http.post<any>(this.loadsDetailsInsertApiUrl, payload).subscribe(
            (response) => {
              console.log('Carga agregada:', response);

              // Obtener y mostrar todos los datos cargados con los parámetros del endpoint
              this.http.get<any[]>(`${this.loadsDetailsApiUrl}/${payload.code_load_trucks}`).subscribe(
                (loads) => {
                  console.log('Datos cargados en loads_trucks:', loads);
                },
                (error) => {
                  console.error('Error fetching loads:', error);
                }
              );

              // Actualizar el estado de la orden a "En Proceso"
              this.updateOrderStatus(order.id);
            },
            (error) => {
              console.error('Error agregando carga:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching products for order:', error);
      }
    );
  }

  updateOrderStatus(orderId: number): void {
    const updatePayload = {
      id: orderId,
      status: 'Proceso'
    };

    this.http.post<any>(this.ordersUpdateApiUrl, updatePayload).subscribe(
      (response) => {
        console.log('Estado de la orden actualizado:', response);
      },
      (error) => {
        console.error('Error actualizando el estado de la orden:', error);
      }
    );
  }
}
