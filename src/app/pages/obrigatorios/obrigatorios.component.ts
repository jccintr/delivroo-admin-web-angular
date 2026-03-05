import { Component, OnInit } from '@angular/core';
import { ObrigatoriosResponse } from '../../models/obrigatorios/obrigatorios-response.interface';
import { ObrigatoriosService } from '../../services/obrigatorios.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-obrigatorios',
  imports: [],
  templateUrl: './obrigatorios.component.html',
  styleUrl: './obrigatorios.component.css'
})
export class ObrigatoriosComponent implements OnInit {

    obrigatorios: ObrigatoriosResponse[] = [];
    showModal= false;
    modalMode: 'create' | 'edit' = 'create';
    selectedObrigatorio?: ObrigatoriosResponse
    showDeleteModal = false;
    extraToDelete?: ObrigatoriosResponse;
    loading = true;
    
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
  

}
