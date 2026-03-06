import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalObrigatorioComponent } from './modal-obrigatorio.component';

describe('ModalObrigatorioComponent', () => {
  let component: ModalObrigatorioComponent;
  let fixture: ComponentFixture<ModalObrigatorioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalObrigatorioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalObrigatorioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
