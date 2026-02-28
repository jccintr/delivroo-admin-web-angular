import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { firstValueFrom } from 'rxjs';
import { PaymentResponse } from '../../models/pagamentos/payment-response.interface';
import { CommonModule } from '@angular/common';
import { ModalPaymentComponent } from "../../components/modals/modal-payment/modal-payment.component";



@Component({
  selector: 'app-pagamentos',
  imports: [CommonModule, ModalPaymentComponent],
  templateUrl: './pagamentos.component.html',
  styleUrl: './pagamentos.component.css'
})
export class PagamentosComponent implements OnInit {

    payments: PaymentResponse[] = [];
    showModal= false;
    modalMode: 'create' | 'edit' = 'create';
    selectedPayment?: PaymentResponse
    showDeleteModal = false;
    paymentToDelete?: PaymentResponse;
    loading = true;

    constructor(private paymentService: PaymentService) { }

    async ngOnInit(): Promise<void> {
          await this.loadPayments();
    }

    async loadPayments() {
        try {
          this.payments = await firstValueFrom(this.paymentService.getPayments());
        } catch (error) {
          console.error('Erro ao carregar pagamentos:', error);
        } finally {
            this.loading = false;
        }
    }

     showPaymentModal(isEdit = false, payment?: PaymentResponse) {
        this.modalMode = isEdit ? 'edit' : 'create';
        this.selectedPayment = payment;
        this.showModal = true;
      }
    
      editarPagamento(pagamento: PaymentResponse) {
        this.showPaymentModal(true, pagamento);
       }
    
      novoPagamento() {
       this.showPaymentModal(false);
      }

       onPaymentSaved() {         
         this.showModal = false;
         this.loadPayments();    
      }

     fecharModal(): void {
       this.showModal = false;
     }

     excluirPagamento(payment: PaymentResponse) {
         this.paymentToDelete = payment;
         this.showDeleteModal = true;
     }

    async confirmDelete() {
      if (!this.paymentToDelete) return;

      try {
        await firstValueFrom(
          this.paymentService.deletePayment(this.paymentToDelete.id)
        );
        
        this.onPaymentSaved(); 
        this.showDeleteModal = false;
       
      } catch (error: any) {
        console.error('Erro ao excluir pagamento:', error);
        alert('Não foi possível excluir o pagamento. Tente novamente.');
      }
}

  cancelDelete() {
    this.showDeleteModal = false;
    this.paymentToDelete = undefined;
  }

}
