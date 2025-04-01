import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducManageComponent } from './produc-manage.component';

describe('ProducManageComponent', () => {
  let component: ProducManageComponent;
  let fixture: ComponentFixture<ProducManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProducManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
