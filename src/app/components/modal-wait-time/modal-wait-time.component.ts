import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-wait-time',
  imports: [FormsModule],
  templateUrl: './modal-wait-time.component.html',
  styleUrl: './modal-wait-time.component.css'
})
export class ModalWaitTimeComponent {

  private storeService = inject(StoreService);

  @Input() set initialValue(value: string) {
    this.tempoEspera = value || '30 a 45 min';
  }

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<string>();

  tempoEspera = '';

  onCancel() {
    this.close.emit();
  }

  async onSave() {
    if (!this.tempoEspera?.trim()) return;

    try {
      const request = { tempo_espera: this.tempoEspera.trim() };
      const response = await this.storeService.updateWaitTime(request).toPromise();

      // Supondo que a API retorna o novo valor no response (ajuste conforme sua API)
      const novoTempo = response?.tempo_espera || this.tempoEspera.trim();

      this.saved.emit(novoTempo);
      this.close.emit();
    } catch (error) {
      console.error('Erro ao atualizar tempo de espera:', error);
      // Aqui você pode mostrar um toast/erro para o usuário
      alert('Não foi possível atualizar o tempo de espera. Tente novamente.');
    }
  }

}
