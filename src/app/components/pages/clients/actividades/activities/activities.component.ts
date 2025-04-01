import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.css'],
    standalone: false
})
export class ActivitiesComponent implements OnInit {
  @Input() accountId: number = 0;
  activeTab: string = 'call';

  constructor() {}

  ngOnInit() {}

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
