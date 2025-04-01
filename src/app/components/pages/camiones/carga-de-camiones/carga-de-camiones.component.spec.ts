import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaDeCamionesComponent } from './carga-de-camiones.component';

describe('CargaDeCamionesComponent', () => {
  let component: CargaDeCamionesComponent;
  let fixture: ComponentFixture<CargaDeCamionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CargaDeCamionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaDeCamionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
