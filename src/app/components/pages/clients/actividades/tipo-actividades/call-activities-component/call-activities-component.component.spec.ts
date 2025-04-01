import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallActivitiesComponentComponent } from './call-activities-component.component';

describe('CallActivitiesComponentComponent', () => {
  let component: CallActivitiesComponentComponent;
  let fixture: ComponentFixture<CallActivitiesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallActivitiesComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallActivitiesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
