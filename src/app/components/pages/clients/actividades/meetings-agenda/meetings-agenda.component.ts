import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-meetings-agenda',
    templateUrl: './meetings-agenda.component.html',
    styleUrls: ['./meetings-agenda.component.css'],
    standalone: false
})
export class MeetingsAgendaComponent implements OnInit {
  @Input() accountId: number = 0;
  meetings: any[] = [];
  selectedMeeting: any = {
    id: null,
    description: '',
    date_meet: '',
    hour_meet: '',
    status: 'Pendiente',
    account_id: null
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadMeetings();
    setInterval(() => this.checkMeetings(), 60000); // Check every minute
  }

  loadMeetings() {
    if (this.accountId) {
      this.http.get(`http://137.184.57.180:3000/api/meets?account_id=${this.accountId}`)
        .subscribe((meetings: any) => {
          this.meetings = meetings.filter((meeting: any) => meeting.account_id === this.accountId);
        });
    }
  }

  addMeeting() {
    const newMeeting = {
      ...this.selectedMeeting,
      account_id: this.accountId
    };

    this.http.post('http://137.184.57.180:3000/api/meets/insert', newMeeting)
      .subscribe(() => {
        this.loadMeetings();
        this.clearSelectedMeeting();
      });
  }

  editMeeting(meeting: any) {
    const updatedMeeting = {
      id: meeting.id,
      description: meeting.description,
      date_meet: meeting.date_meet,
      hour_meet: meeting.hour_meet,
      status: meeting.status,
      account_id: this.accountId
    };

    this.http.post('http://137.184.57.180:3000/api/meets/update', updatedMeeting)
      .subscribe(() => this.loadMeetings());
  }

  deleteMeeting(meetingId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`http://137.184.57.180:3000/api/meets/delete/${meetingId}`)
          .subscribe(() => this.loadMeetings());
      }
    });
  }

  addOrUpdateMeeting() {
    if (this.selectedMeeting.id) {
      this.editMeeting(this.selectedMeeting);
    } else {
      this.addMeeting();
    }
  }

  selectMeeting(meeting: any) {
    this.selectedMeeting = { ...meeting };
  }

  clearSelectedMeeting() {
    this.selectedMeeting = {
      id: null,
      description: '',
      date_meet: '',
      hour_meet: '',
      status: 'Pendiente',
      account_id: null
    };
  }

  markAsCompleted(meeting: any) {
    meeting.status = 'Completado';
    this.editMeeting(meeting);
  }

  cancelMeeting(meeting: any) {
    meeting.status = 'Cancelado';
    this.editMeeting(meeting);
  }

  get pendingMeetings() {
    return this.meetings.filter(meeting => meeting.status === 'Pendiente');
  }

  get completedMeetings() {
    return this.meetings.filter(meeting => meeting.status === 'Completado');
  }

  get canceledMeetings() {
    return this.meetings.filter(meeting => meeting.status === 'Cancelado');
  }

  checkMeetings() {
    const now = new Date();
    this.meetings.forEach(meeting => {
      const meetingDate = new Date(`${meeting.date_meet}T${meeting.hour_meet}`);
      const diff = meetingDate.getTime() - now.getTime();
      if (diff > 0 && diff <= 3600000 && meeting.status === 'Pendiente') {
        this.snackBar.open(`Tienes una reunión pendiente en menos de una hora: ${meeting.description}`, 'Cerrar', {
          duration: 10000 // Duración de 10 segundos
        });
      }
    });
  }
}
