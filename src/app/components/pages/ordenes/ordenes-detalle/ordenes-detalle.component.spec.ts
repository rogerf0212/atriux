import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesDetalleComponent } from './ordenes-detalle.component';

describe('OrdenesDetalleComponent', () => {
  let component: OrdenesDetalleComponent;
  let fixture: ComponentFixture<OrdenesDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdenesDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
