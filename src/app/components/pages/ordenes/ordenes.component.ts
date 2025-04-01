import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-ordenes',
    templateUrl: './ordenes.component.html',
    styleUrls: ['./ordenes.component.css'],
    standalone: false
})
export class OrdenesComponent implements OnInit {

  accounts: any[] = [];

  private apiUrl = 'http://137.184.57.180:3000/api/accounts';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchAccounts();
  }

  fetchAccounts(): void {
    this.http.get<any>(this.apiUrl).subscribe(
      (data) => {
        this.accounts = data;
      },
      (error) => {
        console.error('Error fetching accounts:', error);
      }
    );
  }

  navigateToClienteOrders(id: string): void {
    this.router.navigate(['/pages/ordenes-clientes', id]);
  }
}
