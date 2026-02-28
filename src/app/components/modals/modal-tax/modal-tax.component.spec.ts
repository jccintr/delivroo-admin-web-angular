import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTaxComponent } from './modal-tax.component';

describe('ModalTaxComponent', () => {
  let component: ModalTaxComponent;
  let fixture: ComponentFixture<ModalTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTaxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
