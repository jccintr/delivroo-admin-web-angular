import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { PaymentService } from '../../../services/payment.service';
import { FormsModule } from '@angular/forms';
import { PagamentoRequest } from '../../../models/pagamentos/pagamento-request.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-modal-payment',
  imports: [FormsModule],
  templateUrl: './modal-payment.component.html',
  styleUrl: './modal-payment.component.css'
})
export class ModalPaymentComponent implements OnInit {


   private paymentService = inject(PaymentService);
   private paymentId?: number;

  @Input() isEditMode = false;         
  @Input() paymentToEdit?: any;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
 

  nome = '';
  ativo: boolean | null = true;
  isSaving = signal(false);
  errorMessage = '';

  ngOnInit(): void {
        if (this.isEditMode && this.paymentToEdit) {
            this.nome     = this.paymentToEdit.nome;
            this.ativo     = this.paymentToEdit.ativo;
            this.paymentId = this.paymentToEdit.id; 
      } else {
           this.reset();
      }
  }

   onCancel() {
    if (this.isSaving()) return;
    this.close.emit();
  }

  async onSave() {
  
      if (this.isSaving() || !this.nome.trim()) return;
  
      this.isSaving.set(true);
      this.errorMessage = '';
  
      try {
        const request: PagamentoRequest = {
          nome: this.nome.trim(),
          ativo: this.ativo
        };
  
        if (this.isEditMode && this.paymentId) {
          await firstValueFrom(this.paymentService.updatePayment(this.paymentId, request));
        } else {
          await firstValueFrom(this.paymentService.addPayment(request));
        }
  
        this.saved.emit();
        this.close.emit();
  
      } catch (error: any) {
        this.errorMessage = error?.error?.message || 
          `Não foi possível ${this.isEditMode ? 'atualizar' : 'criar'} a categoria.`;
      } finally {
        this.isSaving.set(false);
      }
  }
  
    reset() {
      this.nome = '';
      this.ativo = true;
      this.errorMessage = '';
    }
}
