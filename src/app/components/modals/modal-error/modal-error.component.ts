import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-modal-error',
  imports: [],
  templateUrl: './modal-error.component.html',
  styleUrl: './modal-error.component.css'
})
export class ModalErrorComponent {

  @Input() title: string = 'Erro ao processar';
  @Input() message: string = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
 

  @Output() close = new EventEmitter<void>();

  isVisible = signal(true);

  onClose() {
    this.close.emit();
  }

}
