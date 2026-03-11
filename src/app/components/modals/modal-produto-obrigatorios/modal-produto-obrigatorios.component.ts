import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ObrigatoriosService } from '../../../services/obrigatorios.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { ObrigatoriosResponse } from '../../../models/obrigatorios/obrigatorios-response.interface';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { ProdutoObrigatorioRequest } from '../../../models/obrigatorios/produto-obrigatorio-request.interface';
import { ProdutoObrigatoriosResponse } from '../../../models/produtos/produto-obrigatorios-response.interface';

@Component({
  selector: 'app-modal-produto-obrigatorios',
   imports: [CommonModule],
  templateUrl: './modal-produto-obrigatorios.component.html',
  styleUrl: './modal-produto-obrigatorios.component.css'
})
export class ModalProdutoObrigatoriosComponent implements OnInit {

  private productService = inject(ProductService);
  private obrigatoriosService = inject(ObrigatoriosService);

  @Input() produtoId!: number;
  @Input() produtoNome: string = '';

  @Output() close = new EventEmitter<void>();

  obrigatorios: ObrigatoriosResponse[] = [];  // Todos os obrigatorios disponíveis no sistema
  produtoObrigatorios: ProdutoObrigatoriosResponse[] = [];  
  associados = new Set<number>();              // IDs dos obrigatorios já associados a este produto
  salvandoIds = new Set<number>();            // IDs em processo de salvamento
  loading = true;
  errorMessage = '';

   ngOnInit(): void {
      if (!this.produtoId) {
        this.errorMessage = 'ID do produto não informado.';
        this.loading = false;
        return;
      }
      this.carregarDados();
  }
  
    async carregarDados() {
      this.loading = true;
      this.errorMessage = '';
  
      try {
        // 1. Carrega TODOS os obrigatorios disponíveis no sistema
        const todosObrigatorios = await firstValueFrom(this.obrigatoriosService.getObrigatorios());
        this.obrigatorios = todosObrigatorios || [];
  
        // 2. Carrega os obrigatorios já associados a este produto
        // Nota: assumindo que getObrigatorios retorna os obrigatorios já vinculados ao produto
        const associadosResponse = await firstValueFrom(this.productService.getObrigatorios(this.produtoId));
        this.produtoObrigatorios = associadosResponse || [];
        console.log('Obrigatórios associados ao produto:', associadosResponse);
        // Marca os IDs que já estão associados
        associadosResponse?.forEach(item => {
          this.associados.add(item.id);
        });
  
      } catch (error: any) {
        console.error('Erro ao carregar dados dos obrigatorios:', error);
        this.errorMessage = 'Não foi possível carregar os obrigatorios. Tente novamente mais tarde.';
      } finally {
        this.loading = false;
      }
    }

     async toggleObrigatorio(obrigatorio: ObrigatoriosResponse) {
        const obrigatorioId = obrigatorio.id;
        console.log('Toggle obrigatório ID:', obrigatorioId);
        console.log('Associados antes da ação:', Array.from(this.associados));
        if (this.salvandoIds.has(obrigatorioId)) return;
    
        this.salvandoIds.add(obrigatorioId);
       
        const estavaAssociado = this.associados.has(obrigatorioId);
    
        try {
          if (estavaAssociado) {
            // Desassociar: deleteObrigatorio (remove a associação produto-adicional)
            console.log('Desassociando obrigatório ID:', obrigatorioId);
            const produtoObrigatorioId = this.produtoObrigatorios.find(o => o.id === obrigatorioId)?.produto_obrigatorio_id;
            console.log('ProdutoObrigatorioId encontrado para desassociação:', produtoObrigatorioId);
            if(produtoObrigatorioId) {
               await firstValueFrom(this.productService.deleteObrigatorio(produtoObrigatorioId) );
            }
            this.associados.delete(obrigatorioId);
          } else {
            // Associar
            const request: ProdutoObrigatorioRequest = {
              produto_id: this.produtoId,
              obrigatorio_id: obrigatorioId
            };
            await firstValueFrom(this.productService.addObrigatorio(request));
            this.associados.add(obrigatorioId);
          }
        } catch (error: any) {
          console.error('Erro ao associar/desassociar obrigatório:', error);
          // Reverte a mudança visual em caso de erro
          if (estavaAssociado) {
            this.associados.add(obrigatorioId);
          } else {
            this.associados.delete(obrigatorioId);
          }
          alert('Não foi possível atualizar a associação. Tente novamente.');
        } finally {
          this.salvandoIds.delete(obrigatorioId);
        }
      }
    
      onClose() {
        this.close.emit();
      }
      isAnySaving(): boolean {
        return this.salvandoIds.size > 0;
      }
    
      isAssociado(extraId: number): boolean {
        return this.associados.has(extraId);
      }

}
