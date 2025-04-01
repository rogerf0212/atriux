import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesClientesComponent } from './ordenes-clientes.component';

describe('OrdenesClientesComponent', () => {
  let component: OrdenesClientesComponent;
  let fixture: ComponentFixture<OrdenesClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdenesClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdenesClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
