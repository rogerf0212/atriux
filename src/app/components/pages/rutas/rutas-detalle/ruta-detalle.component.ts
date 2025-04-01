import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { MapService } from '../../../services/maap.service';

interface Route {
  id: number;
  description: string;
  user_id: number;
}

interface RouteAccount {
  account_id: number;
  description: string;
  latitud: number;
  longitud: number;
}

@Component({
  selector: 'app-ruta-detalle',
  templateUrl: './ruta-detalle.component.html',
  styleUrls: ['./ruta-detalle.component.css'],
  standalone: false
})
export class RutaDetalleComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  routeId: number;
  routeDescription: string;
  currentRoute: Route | undefined;
  accounts: any[] = [];
  routeAccounts: RouteAccount[] = [];
  routeAccountForm: FormGroup;
  private destinationCoords: google.maps.LatLngLiteral | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private mapService: MapService
  ) {
    this.routeId = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.routeDescription = this.activatedRoute.snapshot.paramMap.get('description')!;

    this.routeAccountForm = this.fb.group({
      account_id: ['', Validators.required],
      route_id: [this.routeId, Validators.required]
    });
  }

  ngOnInit() {
    console.log('ngOnInit ejecutado');
    this.loadRoute();
    this.loadAccounts(() => {
      this.loadRouteAccounts();
    });
  }

  ngAfterViewInit() {
    if (this.map && this.map.googleMap) {
      console.log('Mapa inicializado correctamente');
      this.mapService.setMap(this.map.googleMap);
    } else {
      console.error('Mapa no inicializado correctamente. Verifica la referencia del ViewChild.');
    }
  }

  loadRoute() {
    this.http.get<Route>(`http://137.184.57.180:3000/api/routes/show_id/${this.routeId}`)
      .subscribe(
        (data) => {
          console.log('Ruta cargada:', data);
          this.currentRoute = data;
        },
        (error) => {
          console.error('Error al cargar la ruta:', error);
        }
      );
  }

  loadAccounts(callback: () => void) {
    this.http.get<any[]>('http://137.184.57.180:3000/api/accounts')
      .subscribe(
        (data) => {
          console.log('Cuentas cargadas:', data);
          this.accounts = data;
          callback();
        },
        (error) => {
          console.error('Error al cargar cuentas:', error);
        }
      );
  }

  loadRouteAccounts() {
    this.http.get<any[]>(`http://137.184.57.180:3000/api/routesaccounts`)
      .subscribe(
        (data) => {
          const filteredData = data.filter(routeAccount => routeAccount.route_id === this.routeId);
          console.log('Cuentas asociadas cargadas:', filteredData);

          this.routeAccounts = filteredData.map((routeAccount: any) => {
            const account = this.accounts.find(acc => acc.id === routeAccount.account_id);
            return {
              account_id: routeAccount.account_id,
              description: account ? account.description : 'Descripción no disponible',
              latitud: account ? account.latitud : null,
              longitud: account ? account.longitud : null
            };
          });
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error al cargar cuentas asociadas a la ruta:', error);
        }
      );
  }

  onSubmit() {
    if (this.routeAccountForm.valid) {
      const { account_id, route_id } = this.routeAccountForm.value;
      const routeAccountData = { account_id, route_id };
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      this.http.post('http://137.184.57.180:3000/api/routesaccounts/insert', JSON.stringify(routeAccountData), { headers })
        .subscribe(response => {
          console.log('Ruta-Account agregada:', response);
          this.loadRouteAccounts();
        }, error => {
          console.error('Error al agregar Ruta-Account:', error);
        });
    }
  }

  deleteRouteAccount(accountId: number) {
    const routeAccountData = { account_id: accountId, route_id: this.routeId };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post('http://137.184.57.180:3000/api/routesaccounts/delete', JSON.stringify(routeAccountData), { headers })
      .subscribe(response => {
        console.log('Ruta-Account eliminada:', response);
        this.loadRouteAccounts();
      }, error => {
        console.error('Error al eliminar Ruta-Account:', error);
      });
  }

  showMap(account: RouteAccount) {
    if (!account.latitud || !account.longitud || isNaN(account.latitud) || isNaN(account.longitud)) {
      console.error('Coordenadas no válidas para la cuenta seleccionada', account);
      return;
    }

    console.log('Coordenadas de la cuenta seleccionada:', account.latitud, account.longitud);

    navigator.geolocation.getCurrentPosition(position => {
      const currentCoords: google.maps.LatLngLiteral = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      const accountCoords: google.maps.LatLngLiteral = {
        lat: account.latitud,
        lng: account.longitud
      };

      this.mapService.setCenter(currentCoords);
      this.mapService.setZoom(15);
      this.mapService.addMarker(currentCoords, 'Ubicación Actual');
      this.mapService.addMarker(accountCoords, account.description);

      this.mapService.calculateRoute(currentCoords, accountCoords).subscribe(
        duration => {
          console.log(`Tiempo estimado de viaje: ${duration.toFixed(2)} minutos`);
        },
        error => {
          console.error(error);
        }
      );

      this.destinationCoords = accountCoords;
    }, error => {
      console.error('Error obteniendo la ubicación:', error);
    });
  }

  startNavigation() {
    if (this.destinationCoords) {
      navigator.geolocation.getCurrentPosition(position => {
        const currentCoords: google.maps.LatLngLiteral = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.mapService.calculateRoute(currentCoords, this.destinationCoords!).subscribe(duration => {
          const durationInMinutes = duration;
          console.log(`Tiempo estimado de viaje: ${durationInMinutes.toFixed(2)} minutos`);

          // Mostrar la ruta en el mapa
          this.mapService.setCenter(currentCoords);
          this.mapService.addMarker(this.destinationCoords!, 'Destino');
        });
      }, error => {
        console.error('Error obteniendo la ubicación:', error);
      });
    } else {
      console.error('No se ha seleccionado un destino');
    }
  }
}
