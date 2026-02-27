import { Component, OnInit } from '@angular/core';
import { CategoryResponse } from '../../models/categorias/category-reponse.interface';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { ModalCategoryComponent } from "../../components/modal-category/modal-category.component";
import { ModalDeleteComponent } from "../../components/modal-delete/modal-delete.component";

@Component({
  selector: 'app-categorias',
  imports: [ModalCategoryComponent, ModalDeleteComponent],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit {

   categories: CategoryResponse[] = [];
    showModal= false;
    modalMode: 'create' | 'edit' = 'create';
    selectedCategory?: CategoryResponse
    showDeleteModal = false;
    categoryToDelete?: CategoryResponse;
    loading = true;

   constructor(private categoryService: CategoryService) { }

    async ngOnInit(): Promise<void> {
         await this.loadCategories();
    }

   async loadCategories() {
      try {
        this.categories = await firstValueFrom(this.categoryService.getCategories());
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
          this.loading = false;
        }
  }

  showCategoryModal(isEdit = false, category?: CategoryResponse) {
  this.modalMode = isEdit ? 'edit' : 'create';
  this.selectedCategory = category;
  this.showModal = true;
}

  editarCategoria(categoria: CategoryResponse) {
    this.showCategoryModal(true, categoria);
   }

  novaCategoria() {
   this.showCategoryModal(false);
  }

  onCategorySaved() {          // ← novo nome
  this.showModal = false;
  this.loadCategories();     // recarrega a lista
}

  fecharModal(): void {
     this.showModal = false;
  }

  excluirCategoria(category: CategoryResponse) {
    if (category.produtos?.length > 0) {
        return;
    }
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  async confirmDelete() {
  if (!this.categoryToDelete) return;

  try {
    await firstValueFrom(
      this.categoryService.deleteCategory(this.categoryToDelete.id)
    );
    
    this.onCategorySaved(); // recarrega a lista (reutilizando o método existente)
    this.showDeleteModal = false;
    // Opcional: mostrar toast de sucesso
    // alert('Categoria excluída com sucesso!');
  } catch (error: any) {
    console.error('Erro ao excluir categoria:', error);
    alert('Não foi possível excluir a categoria. Tente novamente.');
  }
}

cancelDelete() {
  this.showDeleteModal = false;
  this.categoryToDelete = undefined;
}

}
