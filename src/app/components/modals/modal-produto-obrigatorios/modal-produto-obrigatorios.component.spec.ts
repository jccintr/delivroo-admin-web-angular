import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProdutoObrigatoriosComponent } from './modal-produto-obrigatorios.component';

describe('ModalProdutoObrigatoriosComponent', () => {
  let component: ModalProdutoObrigatoriosComponent;
  let fixture: ComponentFixture<ModalProdutoObrigatoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProdutoObrigatoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProdutoObrigatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
