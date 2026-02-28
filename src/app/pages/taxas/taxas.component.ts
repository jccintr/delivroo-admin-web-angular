import { Component, OnInit } from '@angular/core';
import { TaxResponse } from '../../models/taxas/tax-response.interface';
import { TaxService } from '../../services/tax.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ModalTaxComponent } from "../../components/modals/modal-tax/modal-tax.component";

@Component({
  selector: 'app-taxas',
  imports: [CommonModule, ModalTaxComponent],
  templateUrl: './taxas.component.html',
  styleUrl: './taxas.component.css'
})
export class TaxasComponent implements OnInit {

   tax: TaxResponse[] = [];
      showModal= false;
      modalMode: 'create' | 'edit' = 'create';
      selectedTax?: TaxResponse
      showDeleteModal = false;
      taxToDelete?: TaxResponse;
      loading = true;
  
      constructor(private taxService: TaxService) { }
  
      async ngOnInit(): Promise<void> {
            await this.loadTaxas();
      }
  
      async loadTaxas() {
          try {
            this.tax = await firstValueFrom(this.taxService.getTax());
          } catch (error) {
            console.error('Erro ao carregar taxas:', error);
          } finally {
              this.loading = false;
          }
      }

        showTaxModal(isEdit = false, tax?: TaxResponse) {
              this.modalMode = isEdit ? 'edit' : 'create';
              this.selectedTax = tax;
              this.showModal = true;
            }
          
            editarTaxa(tax: TaxResponse) {
              this.showTaxModal(true, tax);
             }
          
            novaTaxa() {
             this.showTaxModal(false);
            }
      
             onTaxSaved() {         
               this.showModal = false;
               this.loadTaxas();    
            }
      
           fecharModal(): void {
             this.showModal = false;
           }
      

}
