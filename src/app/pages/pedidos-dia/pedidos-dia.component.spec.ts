import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDiaComponent } from './pedidos-dia.component';

describe('PedidosDiaComponent', () => {
  let component: PedidosDiaComponent;
  let fixture: ComponentFixture<PedidosDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosDiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
