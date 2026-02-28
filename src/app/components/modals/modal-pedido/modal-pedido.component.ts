import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PedidosResponse } from '../../../models/pedidos/pedidos-response.interface';
import { CommonModule } from '@angular/common';
import { ItemPedidoCardComponent } from "../../item-pedido-card/item-pedido-card.component";

@Component({
  selector: 'app-modal-pedido',
  imports: [CommonModule, ItemPedidoCardComponent],
  templateUrl: './modal-pedido.component.html',
  styleUrl: './modal-pedido.component.css'
})
export class ModalPedidoComponent {

  @Input() pedido!: PedidosResponse;   

  @Output() close = new EventEmitter<void>();

  isLoading = signal(false);

  // Método auxiliar para formatar o total (pode ser movido para pipe depois)
  getTotalFormatado(): string {
    if (!this.pedido) return '—';

    const total = (this.pedido.total ?? 0) +
      (this.pedido.delivery ? this.parseTaxaEntrega(this.pedido.taxa_entrega) : 0);

    return total.toFixed(2).replace('.', ',');
  }

  private parseTaxaEntrega(taxaStr: string | undefined): number {
    if (!taxaStr) return 0;
    const limpa = taxaStr.trim().replace(',', '.');
    const valor = parseFloat(limpa);
    return isNaN(valor) ? 0 : valor;
  }

  onClose() {
    this.close.emit();
  }
  
}
