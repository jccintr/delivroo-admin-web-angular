import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { PedidosResponse } from '../../models/pedidos/pedidos-response.interface';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {

  pedidos: PedidosResponse[] = [];

   constructor(private storeService: StoreService) { }


  async ngOnInit(): Promise<void> {

     try {
          this.pedidos = await firstValueFrom(this.storeService.getPedidos());
          console.log('Pedidos:', this.pedidos);
    } catch (error) {
          console.error('Erro ao carregar pedidos:', error);
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


  }


