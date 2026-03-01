import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-currency-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './currency-input.component.html',
  styleUrl: './currency-input.component.css'
})
export class CurrencyInputComponent {

  @Input() label: string = 'Valor (R$)';
  @Input() placeholder: string = '0,00';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';

  // Valor interno como string (o que o usuário vê e edita)
  valorDigitado = signal<string>('');

  // Valor numérico real (para binding externo)
  @Input() set value(val: number | null | undefined) {
    if (val == null || isNaN(val)) {
      this.valorDigitado.set('');
    } else {
      this.valorDigitado.set(
        val.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      );
    }
  }

  @Output() valueChange = new EventEmitter<number | null>();

  // Getter para facilitar uso em templates pai (opcional)
  get numericValue(): number | null {
    const str = this.valorDigitado().replace(/\./g, '').replace(',', '.');
    const num = parseFloat(str);
    return isNaN(num) ? null : num;
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value;

    // Limpa tudo que não é número ou vírgula
    valor = valor.replace(/[^\d,]/g, '');

    // Permite apenas uma vírgula
    const partes = valor.split(',');
    if (partes.length > 2) {
      valor = partes[0] + ',' + partes.slice(1).join('');
    }

    // Limita a 2 casas decimais
    if (partes[1] && partes[1].length > 2) {
      valor = partes[0] + ',' + partes[1].substring(0, 2);
    }

    this.valorDigitado.set(valor);
  }

  onBlur(): void {
    const valor = this.valorDigitado().trim();

    if (!valor) {
      this.valorDigitado.set('');
      this.valueChange.emit(null);
      return;
    }

    // Converte para number
    let numero = parseFloat(valor.replace(',', '.'));

    if (isNaN(numero)) {
      numero = 0;
    }

    // Formata com 2 casas + milhar
    const formatado = numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    this.valorDigitado.set(formatado);
    this.valueChange.emit(numero);
  }

  // Método para limpar (útil em reset de form)
  clear() {
    this.valorDigitado.set('');
    this.valueChange.emit(null);
  }

}
