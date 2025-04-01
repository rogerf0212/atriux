import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailActivitiesComponent } from './email-activities.component';

describe('EmailActivitiesComponent', () => {
  let component: EmailActivitiesComponent;
  let fixture: ComponentFixture<EmailActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
