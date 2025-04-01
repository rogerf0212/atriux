import { Component, OnInit } from '@angular/core';
import { unitOrganizations } from '../../interfaces/data.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { UnitDialogComponent } from '../dialogs/unit-dialog/unit-dialog.component';
import { UnitEditDialogComponent } from '../dialogs/unit-edit-dialog/unit-edit-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
    templateUrl: './list-page.component.html',
    styles: ``,
    styleUrls: ['./list-page.component.css'],
    standalone: false
})
export class ListPageComponent implements OnInit {
  public units: unitOrganizations[] = [];
  public emptyUnit: unitOrganizations = {
    Code: '',
    Description: '',
    created_at: ''
  };
  public filteredUnits: unitOrganizations[] = []; // Para almacenar las unidades filtradas
  public searchTerm: string = ''; 

  private apiUrl = 'http://137.184.57.180:3000/api/unitorganizations';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getUnits();
  }

  getUnits() {
    this.http.get<unitOrganizations[]>(this.apiUrl).subscribe(
      units => {
        console.log('Unidades recibidas:', units);
        this.units = units;
        this.filteredUnits = units; // Inicializa filteredUnits con todas las unidades
      },
      error => {
        console.error('Error al obtener unidades:', error);
        this.units = [];
        this.filteredUnits = [];
      }
    );
  }

  openDialog(unit: unitOrganizations) {
    const dialogRef = this.dialog.open(UnitDialogComponent, {
      data: unit // Pasa la unidad como datos al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUnits(); // Actualiza la lista de unidades automáticamente
      }
    });
  }

  openDialogEdit(unit: unitOrganizations) {
    console.log('Unidad a editar:', unit); // Verifica que el ID esté presente
    const dialogRef = this.dialog.open(UnitEditDialogComponent, {
      data: unit // Pasa la unidad como datos al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Unidad editada:', result);
        const index = this.units.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.units[index] = result; // Actualiza la unidad editada
          this.filteredUnits[index] = result; // Actualiza la unidad editada en la lista filtrada
        }
      }
    });
  }

  deleteUnit(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        const deleteUrl = `${this.apiUrl}/delete/${id}`;
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        this.http.delete(deleteUrl, { headers }).subscribe(() => {
          console.log('Unidad eliminada:', id);
          this.units = this.units.filter(unit => unit.id !== id); // Elimina la unidad de la lista
          this.filteredUnits = this.filteredUnits.filter(unit => unit.id !== id); // Elimina la unidad de la lista filtrada

          Swal.fire(
            'Eliminada!',
            'La unidad ha sido eliminada.',
            'success'
          );
        }, error => {
          console.error('Error al eliminar la unidad:', error);
          Swal.fire('Error!', 'No se pudo eliminar la unidad. Intenta nuevamente.', 'error');
        });
      }
    });
  }

  filterUnits() {
    if (!this.searchTerm) {
      this.filteredUnits = this.units; // Si el término de búsqueda está vacío, muestra todas las unidades
      return;
    }
    this.filteredUnits = this.units.filter(unit => 
      (unit.Code?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) || 
      (unit.Description?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false)
    );
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.units);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Unidades');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, 'unidades_organizativas.xlsx');
  }
}
