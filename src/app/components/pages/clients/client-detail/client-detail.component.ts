import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-client-detail',
    templateUrl: './client-detail.component.html',
    styleUrls: ['./client-detail.component.css'],
    standalone: false
})
export class ClientDetailComponent implements OnInit {
  client: any;
  activeTab = 'detail'; // Tab activa por defecto
  isOpen = false; // Estado inicial del acordeón
  typesOfAccounts: any[] = [];
  showClientManage = false; // Controla la visibilidad del componente de administración

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const clientId = this.route.snapshot.paramMap.get('id');
    this.loadClientDetails(clientId);
    this.loadTypeAccounts();
  }

  loadClientDetails(clientId: string | null) {
    if (clientId) {
      this.http.get(`http://137.184.57.180:3000/api/accounts/show_id/${clientId}`)
        .subscribe(client => this.client = client);
    }
  }

  loadTypeAccounts() {
    this.http.get('http://137.184.57.180:3000/api/typeaccounts')
      .subscribe((response: any) => {
        this.typesOfAccounts = response;
      }, error => {
        console.error('Error loading type accounts:', error);
      });
  }

  getTypeAccountDescription(typeAccountId: number): string {
    const accountType = this.typesOfAccounts.find(type => type.id === typeAccountId);
    return accountType ? accountType.description : 'Desconocido';
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  navigateToMeetingsAgenda() {
    this.router.navigate(['/meetings-agenda']);
  }

  toggleAccordion() {
    this.isOpen = !this.isOpen; // Cambia el estado al hacer clic
  }

  manageClient() {
    console.log('Administrar Cliente:', this.client);
    this.showClientManage = !this.showClientManage; // Toggle visibility of the management component
  }
}
