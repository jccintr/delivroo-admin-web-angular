import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ObrigatoriosService } from '../../../services/obrigatorios.service';
import { firstValueFrom } from 'rxjs';
import { ObrigatoriosRequest } from '../../../models/obrigatorios/obrigatorios-request.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-obrigatorio',
  imports: [FormsModule],
  templateUrl: './modal-obrigatorio.component.html',
  styleUrl: './modal-obrigatorio.component.css'
})
export class ModalObrigatorioComponent {

  private obrigatoriosService = inject(ObrigatoriosService);

  @Input() isEditMode = false;
  @Input() obrigatorioToEdit?: any;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  nome = '';
  opcoes: string[] = [];
  novaOpcao = '';
  obrigatorioId?: number;

  isSaving = signal(false);
  errorMessage = '';

  ngOnInit(): void {
    if (this.isEditMode && this.obrigatorioToEdit) {
      this.nome = this.obrigatorioToEdit.nome;
      this.opcoes = [...(this.obrigatorioToEdit.opcoes || [])];
      this.obrigatorioId = this.obrigatorioToEdit.id;
    } else {
      this.reset();
    }
  }

  adicionarOpcao() {
    const valor = this.novaOpcao.trim();
    if (valor) {
      this.opcoes.push(valor);
      this.novaOpcao = '';
    }
  }

  removerOpcao(index: number) {
    this.opcoes.splice(index, 1);
  }

  onCancel() {
    if (this.isSaving()) return;
    this.close.emit();
  }

  async onSave() {
    if (this.isSaving() || !this.nome.trim() || this.opcoes.length === 0) return;

    this.isSaving.set(true);
    this.errorMessage = '';

    try {
      const request: ObrigatoriosRequest = {
        nome: this.nome.trim(),
        opcoes: this.opcoes
      };

      if (this.isEditMode && this.obrigatorioId) {
        await firstValueFrom(this.obrigatoriosService.updateObrigatorio(this.obrigatorioId, request));
      } else {
        await firstValueFrom(this.obrigatoriosService.addObrigatorio(request));
      }

      this.saved.emit();
      this.close.emit();

    } catch (error: any) {
      this.errorMessage = error?.error?.message ||
        `Não foi possível ${this.isEditMode ? 'atualizar' : 'criar'} o item obrigatório.`;
    } finally {
      this.isSaving.set(false);
    }
  }

  private reset() {
    this.nome = '';
    this.opcoes = [];
    this.novaOpcao = '';
    this.errorMessage = '';
    this.obrigatorioId = undefined;
  }

}
