import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MapService } from '../../../services/map.service'; // Importar el servicio de mapas
import { Map, NavigationControl, GeolocateControl } from 'mapbox-gl'; // Importar controles de mapbox-gl

@Component({
    selector: 'app-add-client-dialog',
    templateUrl: './add-client-dialog.component.html',
    styleUrls: ['./add-client-dialog.component.css'],
    standalone: false
})
export class AddClientDialogComponent implements OnInit {
  clientForm: FormGroup;
  typesOfAccounts: any[] = [];
  private map!: Map; // Variable para almacenar el mapa
  searchQuery: string = ''; // Para almacenar la búsqueda del usuario

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private mapService: MapService, // Inyectar el servicio de mapas
    public dialogRef: MatDialogRef<AddClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clientForm = this.fb.group({
      description: ['', Validators.required],
      rnc_cedula: ['', Validators.required],
      type_account: ['', Validators.required],
      note: [''],
      country: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      phone1: ['', Validators.required],
      phone2: [''],
      email: ['', [Validators.required, Validators.email]],
      latitud: ['', Validators.required],
      longitud: ['', Validators.required],
      credit_limit: ['', Validators.required],
      credit_consumed: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadTypeAccounts();
    this.initializeMap(); // Inicializar el mapa al iniciar el componente
  }

  loadTypeAccounts() {
    this.http.get('http://137.184.57.180:3000/api/typeaccounts')
      .subscribe((response: any) => {
        this.typesOfAccounts = response;
      }, error => {
        console.error('Error loading type accounts:', error);
      });
  }

  initializeMap() {
    this.map = new Map({
      container: 'map', // ID del contenedor del mapa en el HTML
      style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
      center: [-74.5, 40], // Coordenadas iniciales del mapa (puedes ajustarlas según tu necesidad)
      zoom: 9, // Nivel de zoom inicial
      accessToken: this.mapService.getMapboxToken() // Asegurarse de que el token se proporciona aquí
    });

    this.mapService.setMap(this.map); // Asegurarse de que el servicio de mapa recibe la instancia del mapa

    this.map.addControl(new NavigationControl());
    this.map.addControl(new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    this.map.on('click', (event) => {
      const coords = [event.lngLat.lng, event.lngLat.lat] as [number, number];
      this.clientForm.patchValue({
        latitud: coords[1],
        longitud: coords[0]
      });

      this.mapService.getReverseGeocoding(coords).subscribe(response => {
        const place = response.features[0];
        const address = place.place_name;
        const city = place.context.find((c: any) => c.id.includes('place')).text;
        const country = place.context.find((c: any) => c.id.includes('country')).text;
        this.clientForm.patchValue({
          address,
          city,
          country
        });
      });
    });
  }

  searchLocation() {
    this.mapService.searchLocation(this.searchQuery).subscribe(response => {
      if (response.features.length > 0) {
        const location = response.features[0];
        const coords = location.center;
        this.map.flyTo({ center: coords, zoom: 14 });
        this.clientForm.patchValue({
          latitud: coords[1],
          longitud: coords[0]
        });

        this.mapService.getReverseGeocoding(coords).subscribe(response => {
          const place = response.features[0];
          const address = place.place_name;
          const city = place.context.find((c: any) => c.id.includes('place')).text;
          const country = place.context.find((c: any) => c.id.includes('country')).text;
          this.clientForm.patchValue({
            address,
            city,
            country
          });
        });
      }
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      const formattedData = {
        description: clientData.description?.toString() ?? null,
        rnc_cedula: clientData.rnc_cedula?.toString() ?? null,
        type_account: clientData.type_account?.toString() ?? null,
        note: clientData.note?.toString() ?? null,
        country: clientData.country?.toString() ?? null,
        city: clientData.city?.toString() ?? null,
        address: clientData.address?.toString() ?? null,
        phone1: clientData.phone1?.toString() ?? null,
        phone2: clientData.phone2?.toString() ?? null,
        email: clientData.email?.toString() ?? null,
        latitud: clientData.latitud ? parseFloat(clientData.latitud) : null,
        longitud: clientData.longitud ? parseFloat(clientData.longitud) : null,
        credit_limit: clientData.credit_limit ? parseFloat(clientData.credit_limit) : null,
        credit_consumed: clientData.credit_consumed ? parseFloat(clientData.credit_consumed) : null
      };

      if (Object.values(formattedData).some(value => value === null)) {
        console.error('Some form values are null:', formattedData);
        return;
      }

      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post('http://137.184.57.180:3000/api/accounts/insert', JSON.stringify(formattedData), { headers })
        .subscribe(response => {
          console.log('Cliente agregado', response);
          this.dialogRef.close(true); // Indicar que se ha agregado un cliente
        });
    }
  }
}
