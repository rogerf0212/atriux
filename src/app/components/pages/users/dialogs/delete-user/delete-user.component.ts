import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../interfaces/user.interfaces';

@Component({
    templateUrl: './delete-user.component.html',
    styles: ``,
    standalone: false
})
export class DeleteUserComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
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
