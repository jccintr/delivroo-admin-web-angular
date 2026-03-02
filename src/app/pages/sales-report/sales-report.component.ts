import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  Chart, 
  ArcElement, 
  BarController, 
  BarElement, 
  CategoryScale, 
  LineController, 
  LineElement, 
  LinearScale, 
  PieController, 
  PointElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { OrderService } from '../../services/order.service';
import { PedidosResponse } from '../../models/pedidos/pedidos-response.interface';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit, AfterViewInit {

  // Seleção de período
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  nomeMes: string = '';

  months: { value: number; label: string }[] = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('pt-BR', { month: 'long' })
  }));

  

  years: number[] = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

  // Dados processados
  totalPedidos: number = 0;
  faturamentoTotal: number = 0;
  taxasEntrega: number = 0;
  descontos: number = 0;
  mediaPedido: number = 0;
  diasVendas: number = 0;

  deliveryData: any = null;
  pagamentoData: any[] = [];
  produtosData: any[] = [];
  vendasPorDia: any[] = [];
  bairrosData: any[] = [];

  // Controle de estado
  isLoading: boolean = false;
  dadosCarregados: boolean = false;

  // Armazena instâncias dos gráficos
  private charts: Chart[] = [];

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {
    // Registro obrigatório de todos os componentes do Chart.js usados
    Chart.register(
      ArcElement,
      BarController,
      BarElement,
      CategoryScale,
      LineController,
      LineElement,
      LinearScale,
      PieController,
      PointElement,
      Tooltip,
      Legend
    );
  }

  ngOnInit(): void {
    this.atualizarNomeMes();
    this.gerarRelatorio();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    if (this.dadosCarregados) {
      setTimeout(() => this.renderGraficos(), 0);
    }
  }

  gerarRelatorio(): void {
    this.atualizarNomeMes();
    this.isLoading = true;
    this.dadosCarregados = false;

    this.destroyCharts();

    this.orderService.getMonthReport(this.selectedMonth, this.selectedYear).subscribe({
      next: (data: PedidosResponse[]) => {
        console.log('Dados recebidos:', data);
        this.processarDados(data);
        this.dadosCarregados = true;
        this.isLoading = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        setTimeout(() => this.renderGraficos(), 0);
      },
      error: (err) => {
        console.error('Erro ao carregar relatório:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Atualiza o nome do mês sempre que selectedMonth mudar
  atualizarNomeMes(): void {
    const mesSelecionado = this.months.find(m => m.value === this.selectedMonth);
    this.nomeMes = mesSelecionado ? mesSelecionado.label.charAt(0).toUpperCase() + mesSelecionado.label.slice(1) : '';
  }

  private processarDados(data: PedidosResponse[]): void {
    this.totalPedidos = data.length;
    this.faturamentoTotal = data.reduce((sum, pedido) => sum + pedido.total, 0);
    this.taxasEntrega = data.reduce((sum, pedido) => sum + parseFloat(pedido.taxa_entrega || '0'), 0);
    this.descontos = data.reduce((sum, pedido) => sum + parseFloat(pedido.desconto || '0'), 0);
    this.mediaPedido = this.totalPedidos > 0 ? this.faturamentoTotal / this.totalPedidos : 0;

    const datasUnicas = new Set(data.map(pedido => pedido.data.split(' ')[0]));
    this.diasVendas = datasUnicas.size;

    const deliveries = data.filter(pedido => pedido.delivery).length;
    this.deliveryData = {
      delivery: deliveries,
      balcao: this.totalPedidos - deliveries,
      percDelivery: this.totalPedidos > 0 ? ((deliveries / this.totalPedidos) * 100).toFixed(2) + '%' : '0%',
      percBalcao: this.totalPedidos > 0 ? (((this.totalPedidos - deliveries) / this.totalPedidos) * 100).toFixed(2) + '%' : '0%'
    };

    const pagamentos = data.reduce((acc, pedido) => {
      acc[pedido.forma_pagamento] = (acc[pedido.forma_pagamento] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    this.pagamentoData = Object.entries(pagamentos).map(([forma, contagem]) => ({
      forma,
      contagem,
      percentual: this.totalPedidos > 0 ? ((contagem / this.totalPedidos) * 100).toFixed(2) + '%' : '0%'
    })).sort((a, b) => b.contagem - a.contagem);

    const produtosMap = data.flatMap(pedido => pedido.itens_pedido).reduce((acc, item) => {
      const nome = item.produto.nome;
      if (!acc[nome]) {
        acc[nome] = { quantidade: 0, receita: 0 };
      }
      acc[nome].quantidade += item.quantidade;
      acc[nome].receita += parseFloat(item.total);
      return acc;
    }, {} as Record<string, { quantidade: number; receita: number }>);

    this.produtosData = Object.entries(produtosMap).map(([nome, info]) => ({
      nome,
      quantidade: info.quantidade,
      receitaEstimada: `R$ ${info.receita.toFixed(2)}`
    })).sort((a, b) => b.quantidade - a.quantidade).slice(0, 6);

    const vendasDiaMap = data.reduce((acc, pedido) => {
      const dia = pedido.data.split(' ')[0];
      if (!acc[dia]) acc[dia] = { pedidos: 0, faturamento: 0 };
      acc[dia].pedidos += 1;
      acc[dia].faturamento += pedido.total;
      return acc;
    }, {} as Record<string, { pedidos: number; faturamento: number }>);

    this.vendasPorDia = Object.entries(vendasDiaMap).map(([dia, info]: [string, any]) => ({
      dia,
      pedidos: info.pedidos,
      faturamento: info.faturamento.toFixed(2),
      media: info.pedidos > 0 ? (info.faturamento / info.pedidos).toFixed(2) : '0.00'
    })).sort((a, b) => a.dia.localeCompare(b.dia));

    const bairrosMap = data.filter(pedido => pedido.delivery).reduce((acc, pedido) => {
      const bairro = pedido.bairro || 'Outros';
      acc[bairro] = (acc[bairro] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalDeliveries = data.filter(pedido => pedido.delivery).length;
    this.bairrosData = Object.entries(bairrosMap).map(([bairro, pedidos]) => ({
      bairro,
      pedidos,
      percentual: totalDeliveries > 0 ? ((pedidos / totalDeliveries) * 100).toFixed(1) + '%' : '0%'
    })).sort((a, b) => b.pedidos - a.pedidos);
  }

  private renderGraficos(): void {
    if (!this.dadosCarregados) return;

    this.destroyCharts();

    this.charts.push(
      new Chart('deliveryChart', {
        type: 'pie',
        data: {
          labels: ['Delivery', 'Balcão/Retirada'],
          datasets: [{ data: [this.deliveryData?.delivery || 0, this.deliveryData?.balcao || 0], backgroundColor: ['#4299e1', '#a0aec4'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      })
    );

    this.charts.push(
      new Chart('pagamentoChart', {
        type: 'bar',
        data: {
          labels: this.pagamentoData.map(p => p.forma),
          datasets: [{ label: 'Quantidade', data: this.pagamentoData.map(p => p.contagem), backgroundColor: '#4299e1' }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      })
    );

    this.charts.push(
      new Chart('produtosChart', {
        type: 'pie',
        data: {
          labels: this.produtosData.map(p => p.nome),
          datasets: [{ data: this.produtosData.map(p => p.quantidade), backgroundColor: ['#4299e1', '#68d391', '#ecc94b', '#ed64a6', '#a0aec4', '#f6ad55'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      })
    );

    this.charts.push(
      new Chart('pedidosDiaChart', {
        type: 'line',
        data: {
          labels: this.vendasPorDia.map(v => v.dia),
          datasets: [{ label: 'Nº de Pedidos', data: this.vendasPorDia.map(v => v.pedidos), borderColor: '#4299e1', fill: true }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      })
    );

    this.charts.push(
      new Chart('faturamentoDiaChart', {
        type: 'line',
        data: {
          labels: this.vendasPorDia.map(v => v.dia),
          datasets: [{ label: 'Faturamento (R$)', data: this.vendasPorDia.map(v => parseFloat(v.faturamento)), borderColor: '#48bb78', fill: true }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      })
    );

    this.charts.push(
      new Chart('bairrosChart', {
        type: 'bar',
        data: {
          labels: this.bairrosData.map(b => b.bairro),
          datasets: [{ label: 'Pedidos', data: this.bairrosData.map(b => b.pedidos), backgroundColor: '#68d391' }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      })
    );
  }

  private destroyCharts(): void {
    this.charts.forEach(chart => chart?.destroy());
    this.charts = [];
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }
}