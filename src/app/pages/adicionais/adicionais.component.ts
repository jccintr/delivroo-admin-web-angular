import { Component, OnInit } from '@angular/core';
import { ExtrasService } from '../../services/extras.service';
import { ExtrasResponse } from '../../models/adicionais/extras-response.interface';
import { firstValueFrom } from 'rxjs';
import { ModalDeleteComponent } from "../../components/modals/modal-delete/modal-delete.component";
import { ModalExtraComponent } from "../../components/modals/modal-extra/modal-extra.component";
import { ModalErrorComponent } from "../../components/modals/modal-error/modal-error.component";
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-adicionais',
  imports: [ModalDeleteComponent, ModalExtraComponent, ModalErrorComponent],
  templateUrl: './adicionais.component.html',
  styleUrl: './adicionais.component.css'
})
export class AdicionaisComponent implements OnInit {

  extras: ExtrasResponse[] = [];
  showModal= false;
  modalMode: 'create' | 'edit' = 'create';
  selectedExtra?: ExtrasResponse
  showDeleteModal = false;
  extraToDelete?: ExtrasResponse;
  loading = true;
  // para o modal error
  showErrorModal = false;
  errorTitle: string = '';
  errorMessage: string = '';
  errorDetails?: string;
  
  constructor(private extrasService: ExtrasService,private errorService: ErrorService) { }

   async ngOnInit(): Promise<void> {
            await this.loadExtras();
      }
  
  async loadExtras() {
      try {
        this.extras = await firstValueFrom(this.extrasService.getExtras());
      } catch (error) {
        console.error('Erro ao carregar extras:', error);
      } finally {
          this.loading = false;
      }
  }

  showExtraModal(isEdit = false, extra?: ExtrasResponse) {
        this.modalMode = isEdit ? 'edit' : 'create';
        this.selectedExtra = extra;
        this.showModal = true;
  }

  editarExtra(extra: ExtrasResponse) {
    this.showExtraModal(true, extra);
  }
    
  novoExtra() {
    this.showExtraModal(false);
  }

  onExtraSaved() {         
    this.showModal = false;
    this.loadExtras();    
  }

  fecharModal(): void {
    this.showModal = false;
  }

  excluirExtra(extra: ExtrasResponse) {
      this.extraToDelete = extra;
      this.showDeleteModal = true;
  }

   async confirmDelete() {
      if (!this.extraToDelete) return;

      try {
        await firstValueFrom(this.extrasService.deleteExtra(this.extraToDelete.id));
        
        this.onExtraSaved(); 
        this.showDeleteModal = false;
      
      } catch (error: any) {
        console.error('Erro ao excluir item adicional:', error);
        this.showDeleteModal = false;
        this.showError('Não foi possível excluir',this.errorService.getApiErrorMessage(error),);
      }
 }

  cancelDelete() {
    this.showDeleteModal = false;
    this.extraToDelete = undefined;
  }

  private showError(title: string, message: string) {
    this.errorTitle = title;
    this.errorMessage = message;
    
    this.showErrorModal = true;
  }

  fecharErrorModal() {
    this.showErrorModal = false;
    this.errorDetails = undefined;
  }
}
