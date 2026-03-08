import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUpdateProdutoComponent } from './modal-update-produto.component';

describe('ModalUpdateProdutoComponent', () => {
  let component: ModalUpdateProdutoComponent;
  let fixture: ComponentFixture<ModalUpdateProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUpdateProdutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalUpdateProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
