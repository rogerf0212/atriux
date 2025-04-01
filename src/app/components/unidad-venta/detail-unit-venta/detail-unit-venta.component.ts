import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddUnitDialogComponent } from '../dialogs/add-unit-dialog/add-unit-dialog.component';

@Component({
    selector: 'app-detail-unit-venta',
    templateUrl: './detail-unit-venta.component.html',
    styleUrls: ['./detail-unit-venta.component.css'],
    standalone: false
})
export class DetailUnitVentaComponent implements OnInit {
  @Input() unit: any; // Define la propiedad unit como una entrada
  salesOrganizations: any[] = [];
  unitOrganizations: any[] = [];
  private salesOrganizationsApiUrl = 'http://137.184.57.180:3000/api/salesorganizations';
  private unitOrganizationsApiUrl = 'http://137.184.57.180:3000/api/unitorganizations';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUnitOrganizations();
  }

  getUnitOrganizations(): void {
    this.http.get<any[]>(this.unitOrganizationsApiUrl).subscribe(data => {
      this.unitOrganizations = data;
      this.getSalesOrganizations(); // Llamar después de obtener las unidades organizativas
    });
  }

  getSalesOrganizations(): void {
    this.http.get<any[]>(this.salesOrganizationsApiUrl).subscribe(data => {
      // Filtrar las unidades de venta por Unit_Organizations_id
      this.salesOrganizations = data.filter(salesOrg => salesOrg.Unit_Organizations_id === this.unit.id);
    });
  }

  getUnitOrganizationDescription(unitOrganizationId: number): string {
    const unitOrg = this.unitOrganizations.find(org => org.id === unitOrganizationId);
    return unitOrg ? unitOrg.Description : 'N/A';
  }

  onAdd() {
    const dialogRef = this.dialog.open(AddUnitDialogComponent, {
      data: { unit: this.unit } // Pasar los datos si es necesario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Unidad agregada y guardada en localStorage:', result);
        this.getSalesOrganizations(); // Refrescar la tabla
      }
    });
  }
}
