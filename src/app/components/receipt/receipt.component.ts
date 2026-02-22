import { Component, Input } from '@angular/core';
import { PedidosResponse } from '../../models/pedidos/pedidos-response.interface';
import { AuthService } from '../../services/auth.service';
import { ItemPedido } from '../../models/pedidos/item-pedido.interface';

@Component({
  selector: 'app-receipt',
  imports: [],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css'
})
export class ReceiptComponent {
  @Input() pedido: PedidosResponse | null | undefined;  // ajuste o tipo se tiver interface (ex: Pedido)

  constructor(private authService: AuthService) {
   }

  imprimir() {

    if (!this.pedido) {
      console.warn('Pedido ou itens não disponíveis para impressão');
      return;
    }

    console.log('Imprimindo pedido:', this.pedido);

    // Monta o HTML completo dinamicamente
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Cupom</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              width: 58mm;
              line-height: 1.2;
            }
            .center { text-align: center; }
            .right { text-align: right; }
            table { width: 100%; border-collapse: collapse; }
            td, th { padding: 2px 0; }
            .total { font-weight: bold; font-size: 13px; }
            .title { font-weight: bold;}
            hr { border: none; border-top: 1px dashed #000; margin: 6px 0; }
            @page {
              size: 58mm auto;
              margin: 2mm 1mm;
            }
          </style>
        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 800);">
          <div class="title center">${this.authService.currentUser()?.name}</div>
          <div class="center">Pedido: ${this.pedido.token}</div>
          <div class="center">${this.pedido.data}</div>
          <div class="center">*** ${this.pedido.delivery?'Entregar':'Retirar'} ***</div>
          <br>
          <div class="title center">CLIENTE</div>
          <div class="center">${this.pedido.nome}</div>
          <div class="center">${this.pedido.telefone}</div>
          <div class="title center">FORMA DE PAGAMENTO</div>
          <div class="center">${this.pedido.forma_pagamento}</div>
          ${this.pedido.delivery ? `
            <div class="title center">ENDEREÇO DE ENTREGA</div>
            <div class="center">${this.pedido.endereco}</div>
            <div class="center">${this.pedido.bairro}</div>
            ` : ''
          }
          ${this.pedido.observacao ? `
             <div class="title center">OBSERVAÇÃO</div>
             <div class="center">${this.pedido.observacao}</div>
          ` : ''}
          <br>
          <div class="title center">ITENS DO PEDIDO</div>
          <hr>
          <table>
  ${this.pedido.itens_pedido.map((item: ItemPedido) => {
    // Garante que as propriedades existam (segurança)
    const obrigatorios = item.obrigatorios || [];
    const adicionais   = item.adicionais   || [];

    return `
      <tr>
        <td style="padding-bottom: 2px;">
          ${item.quantidade} ${item.produto?.nome || 'Produto sem nome'}
        </td>
        <td class="right" style="padding-bottom: 2px;">
          R$ ${(item.total).replace('.', ',')}
        </td>
      </tr>
      ${obrigatorios.length > 0 ? `
        <tr>
          <td colspan="2" style="padding: 0 0 2px 12px; font-size: 11px;">
            ${obrigatorios.map(obs => `<div>${obs}</div>`).join('')}
          </td>
        </tr>
      ` : ''}
      ${adicionais.length > 0 ? `
        <tr>
          <td colspan="2" style="padding: 0 0 4px 12px; font-size: 11px;">
            ${adicionais.map(adic => `<div>+ ${adic.toString().replace('.', ',')}</div>`).join('')}
          </td>
        </tr>
      ` : ''}
      <tr><td colspan="2" style="height: 2px;"></td></tr> <!-- pequeno espaçamento entre itens -->
    `;
  }).join('')}
</table>
          <hr>
           ${this.pedido.delivery ? `
            <div class="right">Total dos produtos: R$ ${this.pedido.total.toFixed(2).replace('.', ',')}</div>
            <div class="right">Taxa de entrega: R$ ${this.pedido.taxa_entrega.replace('.', ',')}</div>
            ` : ''
          }
          <div class="total right">Total a pagar: R$ ${this.getTotalExibidoFormatado(this.pedido)}</div>
          <div class="center">Obrigado pela preferência!</div>
          <div style="height: 15mm;"></div> <!-- espaço para corte -->
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'height=600,width=400');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();  // importante para renderizar
    } else {
      console.error('Falha ao abrir janela de impressão. Verifique bloqueador de pop-ups.');
      alert('Não foi possível abrir a janela de impressão. Desative o bloqueador de pop-ups para este site.');
    }
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