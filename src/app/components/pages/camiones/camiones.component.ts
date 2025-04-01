import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-camiones',
    templateUrl: './camiones.component.html',
    styleUrls: ['./camiones.component.css'],
    standalone: false
})
export class CamionesComponent implements OnInit {

  trucks: any[] = [];
  newTruckDescription: string = '';

  private trucksApiUrl = 'http://137.184.57.180:3000/api/trucks';
  private addTruckApiUrl = 'http://137.184.57.180:3000/api/trucks/insert';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadTrucks();
  }

  loadTrucks(): void {
    this.http.get<any[]>(this.trucksApiUrl).subscribe(
      (data) => {
        this.trucks = data;
      },
      (error) => {
        console.error('Error fetching trucks:', error);
      }
    );
  }

  addTruck(): void {
    if (this.newTruckDescription.trim() === '') {
      return;
    }

    const newTruck = { description: this.newTruckDescription };

    this.http.post<any>(this.addTruckApiUrl, newTruck).subscribe(
      (response) => {
        console.log('Truck added:', response);
        this.newTruckDescription = '';
        this.loadTrucks(); // Refrescar la lista de camiones después de agregar uno nuevo
      },
      (error) => {
        console.error('Error adding truck:', error);
      }
    );
  }

  navigateToCargaDeCamiones(truck: any): void {
    this.router.navigate(['/pages/carga-de-camiones', truck.id, truck.description]);
  }
}
