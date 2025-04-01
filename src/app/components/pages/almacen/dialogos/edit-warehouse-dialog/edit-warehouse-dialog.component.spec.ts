import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWarehouseDialogComponent } from './edit-warehouse-dialog.component';

describe('EditWarehouseDialogComponent', () => {
  let component: EditWarehouseDialogComponent;
  let fixture: ComponentFixture<EditWarehouseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditWarehouseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWarehouseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
