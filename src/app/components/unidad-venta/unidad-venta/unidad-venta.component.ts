import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

interface UnitOrganization {
  Code: string;
  Description: string;
  id: string;
  created_at: string;
}

@Component({
    selector: 'app-unit-list',
    templateUrl: './unidad-venta.component.html',
    styleUrls: ['./unidad-venta.component.css'],
    standalone: false
})
export class UnitListComponent implements OnInit, AfterViewInit {
  units: UnitOrganization[] = [];
  filteredUnits: UnitOrganization[] = [];
  searchTerm: string = '';
  dataSource: MatTableDataSource<UnitOrganization> = new MatTableDataSource();
  selectedUnit?: UnitOrganization;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private apiUrl = 'http://137.184.57.180:3000/api/unitorganizations';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUnits();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getUnits() {
    this.http.get<UnitOrganization[]>(this.apiUrl).subscribe(units => {
      this.units = units;
      this.filteredUnits = units;
      this.dataSource.data = units;
    });
  }

  filterUnits() {
    if (!this.searchTerm) {
      this.filteredUnits = this.units;
    } else {
      this.filteredUnits = this.units.filter(unit => 
        unit.Code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        unit.Description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.dataSource.data = this.filteredUnits;
  }

  selectUnit(unit: UnitOrganization) {
    this.selectedUnit = unit;
  }
}
