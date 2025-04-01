import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWarehouseDialogComponent } from './add-warehouse-dialog.component';

describe('AddWarehouseDialogComponent', () => {
  let component: AddWarehouseDialogComponent;
  let fixture: ComponentFixture<AddWarehouseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWarehouseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWarehouseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
