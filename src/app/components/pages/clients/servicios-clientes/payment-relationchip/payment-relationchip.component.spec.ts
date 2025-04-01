import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRelationchipComponent } from './payment-relationchip.component';

describe('PaymentRelationchipComponent', () => {
  let component: PaymentRelationchipComponent;
  let fixture: ComponentFixture<PaymentRelationchipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentRelationchipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRelationchipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
