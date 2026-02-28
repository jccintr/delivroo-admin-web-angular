import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-modal-delete',
  imports: [CommonModule],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.css'
})
export class ModalDeleteComponent {

  @Input() title: string = 'Confirmar exclusão';
  @Input() message: string = 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.';
  @Input() itemName: string = '';           // ex: "Categoria 'Bebidas'", "Taxa de entrega", etc.
  @Input() isDangerous = true;              // controla cor do botão (vermelho se true)

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isDeleting = signal(false);

  onCancel() {
    if (this.isDeleting()) return;
    this.cancel.emit();
  }

  async onConfirm() {
    if (this.isDeleting()) return;

    this.isDeleting.set(true);

    try {
      // Aqui apenas emitimos — a lógica de delete fica no componente pai
      this.confirm.emit();
    } catch (error) {
      console.error('Erro durante confirmação de exclusão:', error);
    } finally {
      // Não fechamos automaticamente aqui → o pai decide (após sucesso ou erro)
      this.isDeleting.set(false);
    }
  }

}
