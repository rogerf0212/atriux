import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.css'],
    standalone: false
})
export class ContactsComponent implements OnInit {
  @Input() accountId: number = 0;
  contacts: any[] = [];
  selectedContact: any = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    phone1: '',
    phone2: '',
    gender: '',
    account_id: null
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    if (this.accountId) {
      this.http.get(`http://137.184.57.180:3000/api/contacts/show_id_account/${this.accountId}`)
        .subscribe((contacts: any) => {
          this.contacts = contacts.filter((contact: any) => contact.account_id === this.accountId);
        });
    }
  }

  addContact() {
    const newContact = {
      ...this.selectedContact,
      account_id: this.accountId
    };

    this.http.post('http://137.184.57.180:3000/api/contacts/insert', newContact)
      .subscribe(() => {
        this.loadContacts();
        this.clearSelectedContact();
      });
  }

  editContact(contact: any) {
    const updatedContact = {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone1: contact.phone1,
      phone2: contact.phone2 || '', // Asegura que phone2 no quede en blanco
      gender: contact.gender,
      account_id: this.accountId
    };

    this.http.post('http://137.184.57.180:3000/api/contacts/update', updatedContact)
      .subscribe(() => this.loadContacts());
  }

  deleteContact(contactId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://137.184.57.180:3000/api/contacts/delete/${contactId}`)
          .subscribe(() => this.loadContacts());
      }
    });
  }

  addOrUpdateContact() {
    if (this.selectedContact.id) {
      this.editContact(this.selectedContact);
    } else {
      this.addContact();
    }
  }

  selectContact(contact: any) {
    this.selectedContact = { ...contact };
  }

  clearSelectedContact() {
    this.selectedContact = {
      id: null,
      first_name: '',
      last_name: '',
      email: '',
      phone1: '',
      phone2: '',
      gender: '',
      account_id: null
    };
  }
}
