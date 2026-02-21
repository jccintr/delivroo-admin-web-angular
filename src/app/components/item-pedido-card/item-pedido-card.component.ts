import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-pedido-card',
  imports: [],
  templateUrl: './item-pedido-card.component.html',
  styleUrl: './item-pedido-card.component.css'
})
export class ItemPedidoCardComponent {

   @Input() item: any|null = null;

}
