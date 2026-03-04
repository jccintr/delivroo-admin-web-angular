import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { ExtrasService } from '../../../services/extras.service';
import { ExtrasRequest } from '../../../models/adicionais/extras-request.interface';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { CurrencyInputComponent } from '../../currency-input/currency-input.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-extra',
  imports: [FormsModule, CurrencyInputComponent],
  templateUrl: './modal-extra.component.html',
  styleUrl: './modal-extra.component.css'
})
export class ModalExtraComponent implements OnInit {

  private extraService = inject(ExtrasService);
  private extraId?: number;

  @Input() isEditMode = false;         
  @Input() extraToEdit?: any;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  nome = '';
  valor: number | null = null;
  isSaving = signal(false);
  errorMessage = '';

    ngOnInit(): void {
    if (this.isEditMode && this.extraToEdit) {
      this.nome = this.extraToEdit.nome;
      
      // Converte o valor do backend (string) para number
      const valorStr = this.extraToEdit.valor.toString().replace(',', '.');
      this.valor = parseFloat(valorStr);
      
      // Não precisa mais formatar aqui — o CurrencyInputComponent recebe o number diretamente
      // e cuida da exibição formatada
     
      this.extraId = this.extraToEdit.id;
    } else {
      this.reset();
    }
  }

  onCancel() {
    if (this.isSaving()) return;
    this.close.emit();
  }

   async onSave() {
      if (this.isSaving() || !this.nome.trim() || this.valor === null || this.valor <= 0) return;
  
      this.isSaving.set(true);
      this.errorMessage = '';
  
      try {
        const request: ExtrasRequest = {
          nome: this.nome.trim(),
          valor: this.valor || 0
        };
  
        if (this.isEditMode && this.extraId) {
          await firstValueFrom(this.extraService.updateExtra(this.extraId, request));
        } else {
          await firstValueFrom(this.extraService.addExtra(request));
        }
  
        this.saved.emit();
        this.close.emit();
  
      } catch (error: any) {
        this.errorMessage = error?.error?.message || 
          `Não foi possível ${this.isEditMode ? 'atualizar' : 'criar'} o extra.`;
      } finally {
        this.isSaving.set(false);
      }
    }
      
     reset() {
      this.nome = '';
      this.valor = null;
      this.errorMessage = '';
    }

}
