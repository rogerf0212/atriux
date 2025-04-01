import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-email-activities',
    templateUrl: './email-activities.component.html',
    styleUrls: ['./email-activities.component.css'],
    standalone: false
})
export class EmailActivitiesComponent implements OnInit {
  @Input() accountId: number = 0;
  emails: any[] = [];
  selectedEmail: any = {
    id: null,
    to_send: '',
    cc: '',
    message: '',
    subject: '',
    date_mail: '',
    account_id: null
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadEmails();
  }

  loadEmails() {
    if (this.accountId) {
      this.http.get(`http://137.184.57.180:3000/api/mails?account_id=${this.accountId}`)
        .subscribe((emails: any) => {
          this.emails = emails.filter((email: any) => email.account_id === this.accountId);
        });
    }
  }

  addEmail() {
    const newEmail = {
      ...this.selectedEmail,
      date_mail: new Date().toISOString().split('T')[0], // Fecha actual
      account_id: this.accountId
    };

    this.http.post('http://137.184.57.180:3000/api/mails/insert', newEmail)
      .subscribe(() => {
        this.loadEmails();
        this.clearSelectedEmail();
      });
  }

  editEmail(email: any) {
    const updatedEmail = {
      id: email.id,
      to_send: email.to_send,
      cc: email.cc,
      message: email.message,
      subject: email.subject,
      date_mail: new Date().toISOString().split('T')[0], // Fecha actual
      account_id: this.accountId
    };

    this.http.post('http://137.184.57.180:3000/api/mails/update', updatedEmail)
      .subscribe(() => this.loadEmails());
  }

  deleteEmail(emailId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://137.184.57.180:3000/api/mails/delete/${emailId}`)
          .subscribe(() => this.loadEmails());
      }
    });
  }

  addOrUpdateEmail() {
    if (this.selectedEmail.id) {
      this.editEmail(this.selectedEmail);
    } else {
      this.addEmail();
    }
  }

  selectEmail(email: any) {
    this.selectedEmail = { ...email };
  }

  clearSelectedEmail() {
    this.selectedEmail = {
      id: null,
      to_send: '',
      cc: '',
      message: '',
      subject: '',
      date_mail: '',
      account_id: null
    };
  }
}
