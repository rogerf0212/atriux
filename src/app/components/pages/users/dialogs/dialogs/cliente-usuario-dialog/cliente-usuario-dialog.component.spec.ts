import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteUsuarioDialogComponent } from './cliente-usuario-dialog.component';

describe('ClienteUsuarioDialogComponent', () => {
  let component: ClienteUsuarioDialogComponent;
  let fixture: ComponentFixture<ClienteUsuarioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClienteUsuarioDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteUsuarioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
