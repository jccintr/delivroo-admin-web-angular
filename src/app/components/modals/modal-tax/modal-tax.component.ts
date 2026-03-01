import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaxService } from '../../../services/tax.service';
import { TaxRequest } from '../../../models/taxas/tax-request.interface';
import { firstValueFrom } from 'rxjs';
import { CurrencyInputComponent } from "../../currency-input/currency-input.component";

@Component({
  selector: 'app-modal-tax',
  imports: [FormsModule, CurrencyInputComponent],
  templateUrl: './modal-tax.component.html',
  styleUrl: './modal-tax.component.css'
})
export class ModalTaxComponent implements OnInit {

  private taxService = inject(TaxService);
  private taxId?: number;

  @Input() isEditMode = false;         
  @Input() taxToEdit?: any;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  bairro = '';
  valor: number | null = null;
  ativo: boolean | null = true;
  isSaving = signal(false);
  errorMessage = '';

  ngOnInit(): void {
    if (this.isEditMode && this.taxToEdit) {
      this.bairro = this.taxToEdit.bairro;
      
      // Converte o valor do backend (string) para number
      const valorStr = this.taxToEdit.valor.toString().replace(',', '.');
      this.valor = parseFloat(valorStr);
      
      // Não precisa mais formatar aqui — o CurrencyInputComponent recebe o number diretamente
      // e cuida da exibição formatada

      this.ativo = this.taxToEdit.ativo;
      this.taxId = this.taxToEdit.id;
    } else {
      this.reset();
    }
  }

  onCancel() {
    if (this.isSaving()) return;
    this.close.emit();
  }

  async onSave() {
    if (this.isSaving() || !this.bairro.trim() || this.valor === null || this.valor <= 0) return;

    this.isSaving.set(true);
    this.errorMessage = '';

    try {
      const request: TaxRequest = {
        bairro: this.bairro.trim(),
        valor: this.valor || 0,
        ativo: this.ativo
      };

      if (this.isEditMode && this.taxId) {
        await firstValueFrom(this.taxService.updateTax(this.taxId, request));
      } else {
        await firstValueFrom(this.taxService.addTax(request));
      }

      this.saved.emit();
      this.close.emit();

    } catch (error: any) {
      this.errorMessage = error?.error?.message || 
        `Não foi possível ${this.isEditMode ? 'atualizar' : 'criar'} a taxa.`;
    } finally {
      this.isSaving.set(false);
    }
  }
    
   reset() {
    this.bairro = '';
    this.valor = null;
    this.ativo = true;
    this.errorMessage = '';
  }
}
