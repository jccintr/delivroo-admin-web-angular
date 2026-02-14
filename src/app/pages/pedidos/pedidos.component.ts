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

excluirPedido(id: string | number | undefined) {
  /*
  if (!id || !confirm('Deseja realmente excluir este pedido?')) return;

  this.storeService.excluirPedido(id).subscribe({
    next: () => {
      this.pedidos = this.pedidos.filter(p => p.id !== id);
      alert('Pedido excluído com sucesso!');
    },
    error: (err) => {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir o pedido.');
    }
  });
  */
}


  }


