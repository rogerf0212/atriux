import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-call-activities',
    templateUrl: './call-activities-component.component.html',
    styleUrls: ['./call-activities-component.component.css'],
    standalone: false
})
export class CallActivitiesComponent implements OnInit {
  @Input() accountId: number = 0;
  calls: any[] = [];
  selectedCall: any = {
    id: null,
    description: '',
    date_call: '',
    hour_call: '',
    status: 'Pendiente',
    account_id: null
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadCalls();
  }

  loadCalls() {
    if (this.accountId) {
      this.http.get(`http://137.184.57.180:3000/api/calls?account_id=${this.accountId}`)
        .subscribe((calls: any) => {
          this.calls = calls.filter((call: any) => call.account_id === this.accountId);
        });
    }
  }

  addCall() {
    const newCall = {
      ...this.selectedCall,
      account_id: this.accountId
    };

    console.log('Adding call:', newCall); // Depuración

    this.http.post('http://137.184.57.180:3000/api/calls/insert', newCall)
      .subscribe(() => {
        this.loadCalls();
        this.clearSelectedCall();
      }, error => {
        console.error('Error adding call:', error); // Depuración
      });
  }

  editCall(call: any) {
    const updatedCall = {
      id: call.id,
      description: call.description,
      date_call: call.date_call,
      hour_call: call.hour_call,
      status: call.status,
      account_id: this.accountId
    };

    console.log('Editing call:', updatedCall); // Depuración

    this.http.post('http://137.184.57.180:3000/api/calls/update', updatedCall)
      .subscribe(() => this.loadCalls(), error => {
        console.error('Error editing call:', error); // Depuración
      });
  }

  deleteCall(callId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://137.184.57.180:3000/api/calls/delete/${callId}`)
          .subscribe(() => this.loadCalls());
      }
    });
  }

  addOrUpdateCall() {
    if (this.selectedCall.id) {
      this.editCall(this.selectedCall);
    } else {
      this.addCall();
    }
  }

  selectCall(call: any) {
    this.selectedCall = { ...call };
  }

  clearSelectedCall() {
    this.selectedCall = {
      id: null,
      description: '',
      date_call: '',
      hour_call: '',
      status: 'Pendiente',
      account_id: null
    };
  }
}