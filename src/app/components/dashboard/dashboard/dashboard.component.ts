import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartData, ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { MapService } from '../../services/map.service';
import mapboxgl from 'mapbox-gl';


// Define la interfaz RouteAccount
interface RouteAccount {
    route_id: number;
    account_id: number;
}

interface Order {
  id: number;
  status: string; // suponer que "status" es de tipo string
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef; // Referencia al contenedor del mapa
    // Definiciones de las variables
    activeClients: number = 0;
    totalOrders: number = 0;
    pendingOrders: number = 0;
    inProgressOrders: number = 0;
    completedOrders: number = 0;
    pendingOrdersPercentage: number = 0;
    inProgressOrdersPercentage: number = 0;
    completedOrdersPercentage: number = 0;
    selectedRouteId: number | null = null; 
    routes: any[] = [];

    public barChartOptions: ChartOptions = {
      responsive: true,
      scales: {
          x: {
              grid: {
                  display: false
              }
          },
          y: {
              beginAtZero: true,
              grid: {
                  color: 'rgba(200, 200, 200, 0.3)'
              }
          }
      },
      plugins: {
          tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#4f46e5',
              bodyColor: '#1f2937'
          }
      }
  };
  
  public barChartLabels: string[] = []; // Para etiquetas de ruta
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataset[] = [];


    // Declaración del gráfico de dona
    public doughnutChartOptions: ChartOptions = {
        responsive: true,
    };

    public doughnutChartLabels: string[] = []; // Para las etiquetas de ruta
    public doughnutChartData: ChartDataset[] = []; // Datos para el gráfico de dona
    public doughnutChartType: ChartType = 'doughnut';

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        private mapService: MapService // Iniciar el servicio del mapa
    ) {}

    ngOnInit(): void {
        this.fetchDashboardData();
        this.getRouteAccounts();
        this.getOrders(); // Cargar cuentas por ruta
    }

    ngAfterViewInit(): void {
      this.initializeMap(); // Inicializa el mapa después de que la vista haya sido renderizada
  }

    fetchDashboardData(): void {
        this.getActiveClients();
        this.getTotalOrders();
        this.getRoutes();
    }

    initializeMap(): void {
      // Inicializar Mapbox
      const mapboxToken = this.mapService.getMapboxToken();
      (mapboxgl as any).accessToken = mapboxToken;

      const map = new mapboxgl.Map({
          container: this.mapContainer.nativeElement,
          style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
          center: [-74.5, 40], // Coordenadas de inicio [longitud, latitud]
          zoom: 1 // Nivel de zoom inicial
      });

      this.mapService.setMap(map); // Asegúrate de que el servicio de mapa recibe la instancia del mapa

      map.on('load', () => {
        map.resize(); // Ajusta el tamaño del mapa al contenedor
    });

      // Añadir controles al mapa
      map.addControl(new mapboxgl.NavigationControl());
      map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
              enableHighAccuracy: true,
          },
          trackUserLocation: true
      }));
  }

    getRouteAccounts(): void {
        this.http.get<RouteAccount[]>('http://137.184.57.180:3000/api/routesaccounts')
            .subscribe(response => {
                this.processRouteAccounts(response);
            }, error => {
                console.error('Error fetching routes accounts', error);
            });
    }

    processRouteAccounts(data: RouteAccount[]): void {
        const routeCount: {[key: number]: number} = {};
        
        // Contar cuántas accounts hay por route_id
        data.forEach((entry: RouteAccount) => {
            const routeId = entry.route_id;
            if (routeCount[routeId]) {
                routeCount[routeId]++;
            } else {
                routeCount[routeId] = 1;
            }
        });

        // Preparar los datos para el gráfico de dona
        this.doughnutChartLabels = Object.keys(routeCount); // Usar los IDs de las rutas como etiquetas
        this.doughnutChartData = [
            { data: Object.values(routeCount), label: 'Clientes por Ruta' } // Usar los conteos como datos
        ];
    }

    // Resto del código permanece igual
    getActiveClients(): void {
        this.http.get<any>('http://137.184.57.180:3000/api/accounts')
            .subscribe(response => {
                this.activeClients = response.length;
            }, error => {
                console.error('Error fetching active clients', error);
            });
    }

    getTotalOrders(): void {
      this.http.get<Order[]>('http://137.184.57.180:3000/api/ordersheader')
          .subscribe(response => {
              this.totalOrders = response.length; // Total de órdenes
              this.calculateOrdersStatus(response); // Ahora calculamos el estado de órdenes con la respuesta completa.
          }, error => {
              console.error('Error fetching total orders', error);
          });
  }

    getOrders(): void {
      this.http.get<Order[]>('http://137.184.57.180:3000/api/ordersheader')
          .subscribe(response => {
              this.calculateOrdersStatus(response);
          }, error => {
              console.error('Error fetching total orders', error);
          });
  }

  calculateOrdersStatus(orders: Order[]): void {
    this.pendingOrders = 100; // Reiniciar conteos
    this.inProgressOrders = 0;
    this.completedOrders = 0;

    orders.forEach((order) => {
        switch (order.status) {
            case 'invoiced':
                this.pendingOrders++;
                break;
            case 'in progress':
                this.inProgressOrders++;
                break;
            case 'completed':
                this.completedOrders++;
                break;
        }
    });

    this.calculateOrdersStatusPercentage(); // Calculamos los porcentajes después de contar
}

calculateOrdersStatusPercentage(): void {
  if (this.totalOrders > 0) {
      this.pendingOrdersPercentage = (this.pendingOrders / this.totalOrders) * 100 || 0; // Asegurar un valor
      this.inProgressOrdersPercentage = (this.inProgressOrders / this.totalOrders) * 100 || 0; // Asegurar un valor
      this.completedOrdersPercentage = (this.completedOrders / this.totalOrders) * 100 || 0; // Asegurar un valor
  } else {
      this.resetOrdersPercentages(); // Reiniciar si no hay órdenes
  }
  this.logOrderStatus(); // Verificar cuenta de órdenes
}



logOrderStatus(): void {
  console.log(`Total Orders: ${this.totalOrders}`);
console.log(`Pending Orders: ${this.pendingOrders}`);
console.log(`In Progress Orders: ${this.inProgressOrders}`);
console.log(`Completed Orders: ${this.completedOrders}`);
}

resetOrdersPercentages(): void {
  this.pendingOrdersPercentage = 0;
  this.inProgressOrdersPercentage = 0;
  this.completedOrdersPercentage = 0;
}

    getRoutes(): void {
        this.http.get<any>('http://137.184.57.180:3000/api/routes')
            .subscribe(response => {
                this.routes = response;
            }, error => {
                console.error('Error fetching routes', error);
            });
    }

    updateRoute(selectedRouteId: number): void {
        this.selectedRouteId = selectedRouteId; // Actualiza la ruta seleccionada
        console.log(`Selected Route ID: ${this.selectedRouteId}`);
    }
}