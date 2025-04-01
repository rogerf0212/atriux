import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitserviceComponent } from './unitservice.component';

describe('UnitserviceComponent', () => {
  let component: UnitserviceComponent;
  let fixture: ComponentFixture<UnitserviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitserviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
