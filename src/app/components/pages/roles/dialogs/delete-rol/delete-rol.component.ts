import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role } from '../../../../interfaces/roles.interfaces';

@Component({
    templateUrl: './delete-rol.component.html',
    styles: ``,
    standalone: false
})
export class DeleteRolComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteRolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role,
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
