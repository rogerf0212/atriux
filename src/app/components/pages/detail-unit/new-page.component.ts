import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { delay, switchMap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';


import { UnitService } from '../../services/unit-organizations.service';
import { unitOrganizations } from '../../interfaces/data.interfaces';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    templateUrl: './new-page.component.html',
    styles: ``,
    standalone: false
})
export class NewPageComponent implements OnInit{

  public unit?: unitOrganizations;

  constructor(private unitService: UnitService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog ){}


  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      // delay(3000),
      switchMap(({id}) => this.unitService.getUnitById(id)),
    )
    .subscribe(unit => {

      if (!unit) return this.router.navigate(['/pages/unidades-organizativas']);
        
      this.unit = unit;
      console.log({unit})
      return;
    })
  }

  goBack():void {

    this.router.navigateByUrl('pages/unidades-organizativas')

  }

  get currentUnit(): unitOrganizations {
    // Asegúrate de que `this.unit` no sea undefined
    if (!this.unit) {
      throw new Error('Unidad no está definida');
    }
    return this.unit; // Devuelve la unidad actual
  }

  onDeleteUnit() {
    const unitId = this.currentUnit.id; // Obtén el ID de la unidad actual

    // Verifica que unitId esté definido
    if (!unitId) {
        console.error('ID de unidad no está definido');
        return; // Salir si no hay ID
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { Description: this.currentUnit.Description } // Pasa la descripción de la unidad al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log('dialog closed');
        if (!result) return; // Si el usuario no confirma, salir

        console.log('deleted');

        // Llama al servicio de eliminación
        this.unitService.deleteUnitById(unitId).subscribe(success => {
            if (success) {
                console.log('Unidad eliminada exitosamente');
                this.router.navigate(['/pages/unidades-organizativas']); // Redirige a la lista de unidades
            } else {
                console.error('Error al eliminar la unidad');
            }
        });
    });
}


}
