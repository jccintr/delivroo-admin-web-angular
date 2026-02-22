import { Component, Input } from '@angular/core';
import { PedidosResponse } from '../../models/pedidos/pedidos-response.interface';

@Component({
  selector: 'app-receipt',
  imports: [],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css'
})
export class ReceiptComponent {
  @Input() pedido: PedidosResponse | null | undefined;  // ajuste o tipo se tiver interface (ex: Pedido)

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
            hr { border: none; border-top: 1px dashed #000; margin: 6px 0; }
            @page {
              size: 58mm auto;
              margin: 2mm 1mm;
            }
          </style>
        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 800);">
          <div class="center">SEU NEGÓCIO</div>
          <div class="center">Minas Gerais - BR</div>
          <div class="center">CNPJ: xx.xxx.xxx/xxxx-xx</div>
          <hr>
          <div>Data: ${new Date().toLocaleString('pt-BR')}</div>
          <hr>
          <table>
            ${this.pedido.itens_pedido.map((item: any) => `
              <tr>
                <td>${item.nome || 'Produto'} x${item.quantidade || 1}</td>
                <td class="right">R$ ${(item.precoUnitario || 0).toFixed(2).replace('.', ',')}</td>
              </tr>
            `).join('')}
          </table>
          <hr>
          <div class="total center">TOTAL: R$ ${this.pedido.total.toFixed(2).replace('.', ',')}</div>
          <div class="center">Volte sempre!</div>
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
}