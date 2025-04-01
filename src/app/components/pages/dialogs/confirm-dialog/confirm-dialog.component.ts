import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { unitOrganizations } from '../../../interfaces/data.interfaces';

@Component({
    templateUrl: './confirm-dialog.component.html',
    styles: ``,
    standalone: false
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
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
