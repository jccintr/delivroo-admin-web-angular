import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CategoryResponse } from '../../models/categorias/category-reponse.interface';
import { StoreService } from '../../services/store.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cardapio',
  imports: [CommonModule],
  templateUrl: './cardapio.component.html',
  styleUrl: './cardapio.component.css'
})
export class CardapioComponent implements OnInit {

  categories: CategoryResponse[] = [];
  expandedCategoryId: number | null = null;
  loading = true;

   constructor(private storeService: StoreService) { }
  
     async ngOnInit(): Promise<void> {
        try {
          this.categories = await firstValueFrom(this.storeService.getCategories());
          console.log('Categorias carregadas:', this.categories);
        } catch (error) {
          console.error('Erro ao carregar categorias:', error);
        } finally {
          this.loading = false;
        }
    }

  toggleCategory(categoryId: number): void {
    this.expandedCategoryId = this.expandedCategoryId === categoryId 
      ? null 
      : categoryId;
   }

  // Funções de ação (implementar depois ou criar modais)
  novoProduto(): void {
    alert('Funcionalidade de criar novo produto - implementar modal');
    // Futuro: abrir modal de criação
  }

  editarProduto(produtoId: number): void {
    alert(`Editar produto ID: ${produtoId}`);
    // Futuro: abrir modal de edição
  }

  clonarProduto(produtoId: number): void {
    alert(`Clonar produto ID: ${produtoId}`);
    // Futuro: lógica de clone + refresh
  }

  excluirProduto(produtoId: number): void {
    if (confirm('Deseja realmente excluir este produto?')) {
      alert(`Excluindo produto ID: ${produtoId}`);
      // Futuro: chamar serviço DELETE + remover da lista
    }
  }

  getPrecoFormatado(preco: string): string {
    const valor = parseFloat(preco.replace(',', '.'));
    return isNaN(valor) ? '—' : `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  totalProdutos(): number {
  return this.categories.reduce((sum, cat) => sum + (cat.produtos?.length || 0), 0);
}

}
