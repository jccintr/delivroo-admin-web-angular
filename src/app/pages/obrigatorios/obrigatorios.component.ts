import { Component, OnInit } from '@angular/core';
import { ObrigatoriosResponse } from '../../models/obrigatorios/obrigatorios-response.interface';
import { ObrigatoriosService } from '../../services/obrigatorios.service';
import { firstValueFrom } from 'rxjs';
import { ModalObrigatorioComponent } from "../../components/modals/modal-obrigatorio/modal-obrigatorio.component";
import { ModalDeleteComponent } from "../../components/modals/modal-delete/modal-delete.component";
import { ModalErrorComponent } from "../../components/modals/modal-error/modal-error.component";

@Component({
  selector: 'app-obrigatorios',
  imports: [ModalObrigatorioComponent, ModalDeleteComponent, ModalErrorComponent],
  templateUrl: './obrigatorios.component.html',
  styleUrl: './obrigatorios.component.css'
})
export class ObrigatoriosComponent implements OnInit {

    obrigatorios: ObrigatoriosResponse[] = [];
    showModal= false;
    modalMode: 'create' | 'edit' = 'create';
    selectedObrigatorio?: ObrigatoriosResponse
    showDeleteModal = false;
    obrigatorioToDelete?: ObrigatoriosResponse;
    loading = true;
    // para o modal error
    showErrorModal = false;
    errorTitle: string = '';
    errorMessage: string = '';
    errorDetails?: string;
    
    constructor(private obrigatoriosService: ObrigatoriosService) { }

     async ngOnInit(): Promise<void> {
          await this.loadObrigatorios();
     }
      
      async loadObrigatorios() {
          try {
            this.obrigatorios = await firstValueFrom(this.obrigatoriosService.getObrigatorios());
          } catch (error) {
            console.error('Erro ao carregar obrigatorios:', error);
          } finally {
              this.loading = false;
          }
      }

      showObrigatorioModal(isEdit = false, obrigatorio?: ObrigatoriosResponse) {
          this.modalMode = isEdit ? 'edit' : 'create';
          this.selectedObrigatorio = obrigatorio;
          this.showModal = true;
      }
      
      editarObrigatorio(obrigatorio: ObrigatoriosResponse) {
          this.showObrigatorioModal(true, obrigatorio);
      }
          
      novoObrigatorio() {
          this.showObrigatorioModal(false);
      }
      
      onObrigatorioSaved() {         
          this.showModal = false;
          this.loadObrigatorios();    
      }
      
      fecharModal(): void {
          this.showModal = false;
      }

      excluirObrigatorio(obrigatorio: ObrigatoriosResponse) {
            this.obrigatorioToDelete = obrigatorio;
            this.showDeleteModal = true;
     }

     async confirmDelete() {
      if (!this.obrigatorioToDelete) return;

      try {
        await firstValueFrom(this.obrigatoriosService.deleteObrigatorio(this.obrigatorioToDelete.id));
        
        this.onObrigatorioSaved(); 
        this.showDeleteModal = false;
      
      } catch (error: any) {
        console.error('Erro ao excluir item obrigatório:', error);
        this.showDeleteModal = false;
        this.showError(
          'Não foi possível excluir',
          'O item obrigatório não pôde ser removido. Ele pode estar sendo utilizado em algum produto.',
          );
      }
 }

  cancelDelete() {
    this.showDeleteModal = false;
    this.obrigatorioToDelete = undefined;
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
