import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user.interfaces';

interface Route {
  id: number;
  description: string;
  user_id: number;
}

@Component({
    selector: 'app-rutas',
    templateUrl: './rutas.component.html',
    styleUrls: ['./rutas.component.css'],
    standalone: false
})
export class RutasComponent implements OnInit {
  routeForm: FormGroup;
  users: User[] = []; // Lista de usuarios
  routes: Route[] = []; // Lista de rutas
  filteredRoutes: Route[] = []; // Lista de rutas filtradas

  constructor(private fb: FormBuilder, private http: HttpClient, private userService: UserService, private router: Router) {
    this.routeForm = this.fb.group({
      description: ['', Validators.required],
      user_id: ['', Validators.required] // Campo user_id
    });
  }

  ngOnInit() {
    this.loadUsers(); // Cargar usuarios al inicializar el componente
    this.loadRoutes(); // Cargar rutas al inicializar el componente
  }

  loadUsers() {
    this.userService.getUser().subscribe(
      (data) => {
        this.users = data; // Almacenar usuarios obtenidos
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  loadRoutes() {
    this.http.get<Route[]>('http://137.184.57.180:3000/api/routes')
      .subscribe(
        (data) => {
          this.routes = data; // Almacenar rutas obtenidas
          this.filteredRoutes = data; // Inicialmente, las rutas filtradas son todas las rutas
        },
        (error) => {
          console.error('Error al cargar rutas:', error);
        }
      );
  }

  onSubmit() {
    if (this.routeForm.valid) {
      const routeData = this.routeForm.value;
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      const requestBody = {
        description: routeData.description,
        user_id: routeData.user_id
      };

      this.http.post('http://137.184.57.180:3000/api/routes/insert', JSON.stringify(requestBody), { headers })
        .subscribe(response => {
          console.log('Ruta agregada:', response);
          this.loadRoutes(); // Recargar rutas después de agregar una nueva
        }, error => {
          console.error('Error al agregar ruta:', error);
        });
    }
  }

  viewRoute(routeId: number) {
    this.router.navigate(['/ruta-detalle', routeId]);
  }

  searchRoutes(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value;
    this.filteredRoutes = this.routes.filter(route => route.description.toLowerCase().includes(searchTerm.toLowerCase()));
  }
}
