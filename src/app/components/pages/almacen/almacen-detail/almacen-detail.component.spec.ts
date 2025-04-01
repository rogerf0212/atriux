import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenDetailComponent } from './almacen-detail.component';

describe('AlmacenDetailComponent', () => {
  let component: AlmacenDetailComponent;
  let fixture: ComponentFixture<AlmacenDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlmacenDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlmacenDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
