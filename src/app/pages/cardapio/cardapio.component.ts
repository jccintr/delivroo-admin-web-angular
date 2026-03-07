import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CategoryResponse } from '../../models/categorias/category-reponse.interface';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { STORAGE_BASE_URL } from '../../constants/api.constants';
import { ProductService } from '../../services/product.service';
import { ProdutosCategory } from '../../models/categorias/produtos-category.interface';
import { ModalDeleteComponent } from "../../components/modals/modal-delete/modal-delete.component";
import { ModalErrorComponent } from "../../components/modals/modal-error/modal-error.component";
import { ErrorService } from '../../services/error.service';

@Component({
  selector: 'app-cardapio',
  imports: [CommonModule, ModalDeleteComponent, ModalErrorComponent],
  templateUrl: './cardapio.component.html',
  styleUrl: './cardapio.component.css'
})
export class CardapioComponent implements OnInit {

  storageBaseUrl = STORAGE_BASE_URL;

  categories: CategoryResponse[] = [];
  expandedCategoryId: number | null = null;
  loading = true;

  showDeleteModal = false;
  productToDelete?: ProdutosCategory;
  // para o modal error
  showErrorModal = false;
  errorTitle: string = '';
  errorMessage: string = '';
  errorDetails?: string;
     

   constructor(private categoryService: CategoryService,private productService: ProductService,private errorService: ErrorService) { }
  
     async ngOnInit(): Promise<void> {
        this.loadProducts();
    }

    async loadProducts() {
      try {
          this.categories = await firstValueFrom(this.categoryService.getCategories());
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

  async clonarProduto(produtoId: number): Promise<void> {
     try {
          await firstValueFrom(this.productService.copyProduct(produtoId));
          console.log('Produto clonado com sucesso:', produtoId);
          this.loadProducts(); 
        } catch (error) {
          console.error('Erro ao clonar produto:', error);
        } finally {
          this.loading = false;
        }
  }

  excluirProduto(product: ProdutosCategory) {
          this.productToDelete = product;
          this.showDeleteModal = true;
  }

  getPrecoFormatado(preco: string): string {
    const valor = parseFloat(preco.replace(',', '.'));
    return isNaN(valor) ? '—' : `R$ ${valor.toFixed(2).replace('.', ',')}`;
  }

  totalProdutos(): number {
  return this.categories.reduce((sum, cat) => sum + (cat.produtos?.length || 0), 0);
}

 getStorageUrl(){
  return STORAGE_BASE_URL + '/';
 }

 async confirmDelete() {

      if (!this.productToDelete) return;

      try {
        await firstValueFrom(this.productService.deleteProduct(this.productToDelete.id));
        this.showDeleteModal = false;
        this.loadProducts();
      } catch (error: any) {
        console.error('Erro ao excluir produto:', error);
        this.showDeleteModal = false;
        this.showError('Não foi possível excluir',this.errorService.getApiErrorMessage(error),);
      }
      
}

  cancelDelete() {
    this.showDeleteModal = false;
    this.productToDelete = undefined;
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
