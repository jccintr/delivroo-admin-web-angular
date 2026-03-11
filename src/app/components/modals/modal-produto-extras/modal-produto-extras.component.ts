import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ExtrasResponse } from '../../../models/adicionais/extras-response.interface';
import { ProdutoExtrasRequest } from '../../../models/adicionais/produto-extras-request.interface';
import { ExtrasService } from '../../../services/extras.service';
import { ProductService } from '../../../services/product.service';
import { ProdutoAdicionaisResponse } from '../../../models/produtos/produto-adicionais-response.interface';

@Component({
  selector: 'app-modal-produto-extras',
  imports: [CommonModule],
  templateUrl: './modal-produto-extras.component.html',
  styleUrl: './modal-produto-extras.component.css'
})
export class ModalProdutoExtrasComponent implements OnInit {

  private productService = inject(ProductService);
  private extrasService = inject(ExtrasService);

  @Input() produtoId!: number;
  @Input() produtoNome: string = '';

  @Output() close = new EventEmitter<void>();

  extras: ExtrasResponse[] = [];               // Todos os extras disponíveis no sistema
  produtoAdicionais: ProdutoAdicionaisResponse[] = [];
  associados = new Set<number>();              // IDs dos extras já associados a este produto
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
      // 1. Carrega TODOS os extras disponíveis no sistema
      const todosExtras = await firstValueFrom(this.extrasService.getExtras());
      this.extras = todosExtras || [];

      // 2. Carrega os extras já associados a este produto
      // Nota: assumindo que getAdicionais retorna os adicionais já vinculados ao produto
      const associadosResponse = await firstValueFrom(this.productService.getAdicionais(this.produtoId));
      console.log('Adicionais associados ao produto:', associadosResponse);
      this.produtoAdicionais = associadosResponse || [];
      console.log('Adicionais associados ao produto (após atribuição):', this.produtoAdicionais);

      // Marca os IDs que já estão associados
      associadosResponse?.forEach(item => {
        this.associados.add(item.id);
      });

    } catch (error: any) {
      console.error('Erro ao carregar dados de extras:', error);
      this.errorMessage = 'Não foi possível carregar os adicionais. Tente novamente mais tarde.';
    } finally {
      this.loading = false;
    }
  }

  async toggleAdicional(extra: ExtrasResponse) {
    const extraId = extra.id;

    if (this.salvandoIds.has(extraId)) return;

    this.salvandoIds.add(extraId);
    const estavaAssociado = this.associados.has(extraId);

    try {
      if (estavaAssociado) {
        // Desassociar: deleteExtra (remove a associação produto-adicional)
        console.log('Desassociando adicional ID:', extraId);
        const produtoAdicionalId = this.produtoAdicionais.find(o => o.id === extraId)?.produto_adicional_id;
        console.log('ProdutoAdicionalId encontrado para desassociação:', produtoAdicionalId);
         if(produtoAdicionalId) {
            await firstValueFrom(this.productService.deleteExtra(produtoAdicionalId));  // Atenção: aqui extraId é o ID do pivot (associação)
         }
        this.associados.delete(extraId);
      } else {
        // Associar
        const request: ProdutoExtrasRequest = {
          produto_id: this.produtoId,
          adicional_id: extraId
        };
        await firstValueFrom(this.productService.addExtra(request));
        this.associados.add(extraId);
      }
    } catch (error: any) {
      console.error('Erro ao associar/desassociar extra:', error);
      // Reverte a mudança visual em caso de erro
      if (estavaAssociado) {
        this.associados.add(extraId);
      } else {
        this.associados.delete(extraId);
      }
      alert('Não foi possível atualizar a associação. Tente novamente.');
    } finally {
      this.salvandoIds.delete(extraId);
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
