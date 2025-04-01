import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymetTermsComponent } from './paymet-terms.component';

describe('PaymetTermsComponent', () => {
  let component: PaymetTermsComponent;
  let fixture: ComponentFixture<PaymetTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymetTermsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymetTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
