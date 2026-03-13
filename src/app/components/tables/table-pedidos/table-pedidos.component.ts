import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PedidosResponse } from '../../../models/pedidos/pedidos-response.interface';
import { ModalStatusComponent } from "../../modals/modal-status/modal-status.component";
import { ModalPedidoComponent } from "../../modals/modal-pedido/modal-pedido.component";
import { CommonModule } from '@angular/common';
import { ReceiptComponent } from "../../receipt/receipt.component";

@Component({
  selector: 'app-table-pedidos',
  imports: [ModalStatusComponent, ModalPedidoComponent, CommonModule, ReceiptComponent],
  templateUrl: './table-pedidos.component.html',
  styleUrl: './table-pedidos.component.css'
})
export class TablePedidosComponent {

  @Input() pedidos: PedidosResponse[] = [];
  @Input() loading: boolean = false;

  @Output() abrirDetalhes = new EventEmitter<PedidosResponse>();
  @Output() alterarStatus = new EventEmitter<PedidosResponse>();

  showPedidoModal = false;
  selectedPedido?: PedidosResponse;

  showStatusModal = false;
  selectedPedidoForStatus?: PedidosResponse;

  getTotalExibidoFormatado(pedido: PedidosResponse): string {
      let total = pedido.total ?? 0;

      if (pedido.delivery !== true) {
        return total.toFixed(2).replace('.', ',');
      }

      const taxaStr = (pedido.taxa_entrega || '0').trim();
      const taxaLimpa = taxaStr.replace(',', '.');
      const taxa = parseFloat(taxaLimpa);

      const totalFinal = isNaN(taxa) ? total : total + taxa;
      return totalFinal.toFixed(2).replace('.', ',');
  }

  abrirModalDetalhes(pedido: PedidosResponse) {
    this.selectedPedido = pedido;
    this.showPedidoModal = true;
    this.abrirDetalhes.emit(pedido); // opcional: se quiser notificar o pai
  }

  fecharModalPedido() {
    this.showPedidoModal = false;
    this.selectedPedido = undefined;
  }

  abrirModalStatus(pedido: PedidosResponse) {
    this.selectedPedidoForStatus = pedido;
    this.showStatusModal = true;
  }

  onStatusChanged(event: { pedidoId: number; novoStatus: any }) {  // ajuste o tipo de novoStatus conforme sua interface
    const pedido = this.pedidos.find(p => p.id === event.pedidoId);
    if (pedido) {
      pedido.status_pedido = {
        ...pedido.status_pedido,
        id: event.novoStatus.id,
        descricao_curta: event.novoStatus.descricao_curta,
      };
    }
    this.showStatusModal = false;
    this.selectedPedidoForStatus = undefined;
  }



}
