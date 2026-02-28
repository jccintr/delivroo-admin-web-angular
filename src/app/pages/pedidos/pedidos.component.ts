import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { PedidosResponse } from '../../models/pedidos/pedidos-response.interface';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { StatusPedido } from '../../models/pedidos/stsatus-pedido.interface';
import { ModalPedidoComponent } from "../../components/modals/modal-pedido/modal-pedido.component";
import { ReceiptComponent } from "../../components/receipt/receipt.component";
import { ModalStatusComponent } from '../../components/modals/modal-status/modal-status.component';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, ModalStatusComponent, ModalPedidoComponent, ReceiptComponent],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {


  pedidos: PedidosResponse[] = [];
  showStatusModal = false;
  selectedPedidoForStatus?: PedidosResponse;
  showPedidoModal = false;
  selectedPedido?: PedidosResponse;
  loading = true;

   constructor(private storeService: StoreService) { }


  async ngOnInit(): Promise<void> {

     try {
          this.pedidos = await firstValueFrom(this.storeService.getPedidos());
          console.log('Pedidos:', this.pedidos);
    } catch (error) {
          console.error('Erro ao carregar pedidos:', error);
    } finally {
          this.loading = false;
        }

    }

  visualizarPedido(pedido: PedidosResponse) {
    /*
  // Exemplo: abrir modal, navegar para detalhe, etc.
  console.log('Visualizar pedido:', pedido);
  // this.router.navigate(['/pedidos', pedido.id]);
  // ou abrir um modal com mais detalhes
  */
}

private getTotalExibido(pedido: PedidosResponse): number {
    let total = pedido.total ?? 0;

    if (pedido.delivery !== true) {
      return total;
    }

    // Tenta converter taxa_entrega (string) para número
    const taxaStr = (pedido.taxa_entrega || '0').trim();
    let taxa = 0;

    // Substitui vírgula por ponto (muito comum no Brasil)
    const taxaLimpa = taxaStr.replace(',', '.');

    // Converte para número
    const parsed = parseFloat(taxaLimpa);

    if (!isNaN(parsed) && isFinite(parsed)) {
      taxa = parsed;
    } else {
      console.warn(`Não foi possível converter taxa_entrega: "${taxaStr}" para número`);
    }

    return total + taxa;
  }

  getTotalExibidoFormatado(pedido: PedidosResponse): string {
    const valor = this.getTotalExibido(pedido);
    return valor.toFixed(2).replace('.', ',');
  }

  abrirModalStatus(pedido: PedidosResponse) {
    this.selectedPedidoForStatus = pedido;
    this.showStatusModal = true;
  }

  // Callback quando o status é alterado com sucesso
  onStatusChanged(event: { pedidoId: number; novoStatus: StatusPedido }) {
    const pedido = this.pedidos.find(p => p.id === event.pedidoId);
    if (pedido) {
      pedido.status_pedido = {
        ...pedido.status_pedido,
        id: event.novoStatus.id,
        descricao_curta: event.novoStatus.descricao_curta,
        // se precisar de mais campos → copie conforme a interface
      };
    }
    this.showStatusModal = false;
    this.selectedPedidoForStatus = undefined;
  }

  

  // Novo método para ação de status (pode usar no lugar ou junto com detalhes)
  alterarStatus(pedido: PedidosResponse) {
    this.abrirModalStatus(pedido);
  }

  abrirModalDetalhes(pedido: PedidosResponse) {
    this.selectedPedido = pedido;
    this.showPedidoModal = true;
 }

 fecharModalPedido() {
    this.showPedidoModal = false;
    this.selectedPedido = undefined;
 }


  }


