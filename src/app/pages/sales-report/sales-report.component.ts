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
import { LastMonth } from '../../models/pedidos/last-month.interface';
import { firstValueFrom } from 'rxjs';

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
  lastMonths: LastMonth[] = this.getLastSixMonths();
  periodoSelecionado: LastMonth | null = this.lastMonths[0];
  nomeMes: string = this.periodoSelecionado?.label.split('/')[0] || '';

  //data: PedidosResponse[] = [];
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
    const today = new Date();
    this.gerarRelatorio(today.getMonth() , today.getFullYear());
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    if (this.dadosCarregados) {
      setTimeout(() => this.renderGraficos(), 0);
    }
  }

  gerarRelatorio(mes:number,ano:number): void {
    this.selectedMonth = mes;
    this.selectedYear = ano;
    this.isLoading = true;
    this.dadosCarregados = false;
    this.destroyCharts();
    this.loadData();
  }

  async loadData() {
     try {
          const reportData = await firstValueFrom( this.orderService.getMonthReport(this.selectedMonth, this.selectedYear));
          this.processarDados(reportData);
          this.dadosCarregados = true;
          this.isLoading = false;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          setTimeout(() => this.renderGraficos(), 0);
        } catch (error) {
          console.error('Erro ao carregar dados:', error);
        } finally {
            this.isLoading = false;
        }
  }
    
  atualizarPeriodo(monthYear: LastMonth): void {
    this.selectedMonth = monthYear.month;
    this.selectedYear = monthYear.year; 
    this.nomeMes = monthYear.label.split('/')[0];
    console.log('Período atualizado para:', monthYear);
    this.gerarRelatorio( monthYear.month, monthYear.year);
  }

  
 private getLastSixMonths(): LastMonth[] {
    const meses: readonly string[] = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ] as const;

    const hoje = new Date();
    let ano = hoje.getFullYear();
    let mes = hoje.getMonth() - 1;

    if (mes < 0) {
        mes = 11;
        ano--;
    }

    const resultado: LastMonth[] = [];

    for (let i = 0; i < 6; i++) {
        resultado.push({ month: mes + 1, year: ano, label: `${meses[mes]}/${ano}` });

        mes--;
        if (mes < 0) {
            mes = 11;
            ano--;
        }
    }

    return resultado;
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
      type: 'bar',
      data: {
        labels: this.produtosData.map(p => p.nome),
        datasets: [{
          label: 'Quantidade',
          data: this.produtosData.map(p => p.quantidade),
          backgroundColor: '#4299e1',
          borderColor: '#2b6cb0',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',           
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantidade Vendida'
            }
          },
          y: {
            ticks: {
              autoSkip: false,
              font: { size: 13 }
            }
          }
        }
      }
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
          datasets: [{ label: 'Pedidos', data: this.bairrosData.map(b => b.pedidos), backgroundColor: '#4299e1' }]
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