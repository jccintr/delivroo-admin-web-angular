import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProdutoExtrasComponent } from './modal-produto-extras.component';

describe('ModalProdutoExtrasComponent', () => {
  let component: ModalProdutoExtrasComponent;
  let fixture: ComponentFixture<ModalProdutoExtrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProdutoExtrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProdutoExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
