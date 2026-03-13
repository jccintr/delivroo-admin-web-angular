import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PedidosResponse } from '../../models/pedidos/pedidos-response.interface';
import { OrderService } from '../../services/order.service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { TablePedidosComponent } from "../../components/tables/table-pedidos/table-pedidos.component";

@Component({
  selector: 'app-pedidos-dia',
  imports: [CommonModule, FormsModule, TablePedidosComponent],
  templateUrl: './pedidos-dia.component.html',
  styleUrl: './pedidos-dia.component.css'
})
export class PedidosDiaComponent implements OnInit {

  pedidos: PedidosResponse[] = [];
  loading = true;

  dataSelecionada: string = '';           // formato YYYY-MM-DD
  dataAtual: string = '';                 // usada para bloquear datas futuras
  dataMinimaPermitida: string = '2023-01-01'; // ajuste conforme o início do seu sistema

  constructor(private orderService: OrderService) {}

  async ngOnInit(): Promise<void> {
    this.dataAtual = new Date().toISOString().split('T')[0]; // ex: 2026-03-13
    this.dataSelecionada = this.dataAtual;                    // inicia no dia atual
    await this.carregarPedidosDoDia();
  }

  async navegarDias(dias: number): Promise<void> {
    const data = new Date(this.dataSelecionada);
    data.setDate(data.getDate() + dias);

    // Não permite ir para o futuro
    if (data > new Date(this.dataAtual)) {
      return;
    }

    this.dataSelecionada = data.toISOString().split('T')[0];
    await this.carregarPedidosDoDia();
  }

  async onDataChange(): Promise<void> {
    // Garante que não vá para o futuro ao digitar manualmente
    if (this.dataSelecionada > this.dataAtual) {
      this.dataSelecionada = this.dataAtual;
    }
    await this.carregarPedidosDoDia();
  }

  private async carregarPedidosDoDia(): Promise<void> {
    this.loading = true;
    this.pedidos = [];

    try {
      console.log('Carregando pedidos para a data:', this.dataSelecionada);
      const pedidos = await firstValueFrom(this.orderService.getOrdersByDay(this.dataSelecionada));
      console.log('Pedidos recebidos:', pedidos);
      this.pedidos = pedidos || [];
    } catch (error) {
      console.error('Erro ao carregar pedidos do dia:', error);
      this.pedidos = [];
    } finally {
      this.loading = false;
    }
  }
 
  get ehDiaAtual(): boolean {
    return this.dataSelecionada === this.dataAtual;
  }

}
