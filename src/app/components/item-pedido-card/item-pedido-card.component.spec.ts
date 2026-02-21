import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPedidoCardComponent } from './item-pedido-card.component';

describe('ItemPedidoCardComponent', () => {
  let component: ItemPedidoCardComponent;
  let fixture: ComponentFixture<ItemPedidoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemPedidoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemPedidoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
