import { Component , Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { unitOrganizations } from '../../../interfaces/data.interfaces';


@Component({
    templateUrl: './unidad-venta-confirm-dialog.component.html',
    styles: ``,
    standalone: false
})
export class UnidadVentaConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UnidadVentaConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: unitOrganizations,
  ) {
    // console.log({data})
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm():void {
    this.dialogRef.close(true)
  }
}
