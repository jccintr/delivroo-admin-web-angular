import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { StatusPedido, STATUS_PEDIDO } from '../../constants/status-pedido.constant';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-modal-status',
  imports: [],
  templateUrl: './modal-status.component.html',
  styleUrl: './modal-status.component.css'
})
export class ModalStatusComponent implements OnInit {

  private storeService = inject(StoreService);

  @Input() pedidoId!: number;           // ID do pedido (obrigatório)
  @Input() currentStatusId?: number;    // Status atual (para pré-seleção)

  @Output() close = new EventEmitter<void>();
  @Output() statusChanged = new EventEmitter<{ 
    pedidoId: number; 
    novoStatus: StatusPedido 
  }>();

  statusOptions = STATUS_PEDIDO;
  selectedStatusId = signal<number | null>(null);
  isSaving = signal(false);

  ngOnInit() {
    // Pré-seleciona o status atual se existir
    if (this.currentStatusId) {
      this.selectedStatusId.set(this.currentStatusId);
    }
  }

  onSelectStatus(status: StatusPedido) {
    this.selectedStatusId.set(status.id);
  }

  onCancel() {
    if (this.isSaving()) return;
    this.close.emit();
  }

  async onSave() {
    if (!this.selectedStatusId() || this.isSaving()) return;

    this.isSaving.set(true);

    try {
      const novoStatusId = this.selectedStatusId()!;
      
      // Chama a API para registrar a mudança de status
      await this.storeService.addStatusLog(this.pedidoId, novoStatusId).toPromise();

      // Encontra o objeto completo do status selecionado
      const novoStatus = this.statusOptions.find(s => s.id === novoStatusId)!;

      // Emite evento para o componente pai atualizar a lista
      this.statusChanged.emit({
        pedidoId: this.pedidoId,
        novoStatus
      });

      this.close.emit();
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      alert('Não foi possível atualizar o status. Tente novamente.');
    } finally {
      this.isSaving.set(false);
    }
  }

  getStatusClass(status: StatusPedido): string {
    const base = 'cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium transition-all border';
    const selected = this.selectedStatusId() === status.id 
      ? 'border-2 border-indigo-500 bg-indigo-50 shadow-sm' 
      : 'border-gray-200 hover:border-gray-400 bg-white';

    return `${base} ${selected}`;
  }

}
