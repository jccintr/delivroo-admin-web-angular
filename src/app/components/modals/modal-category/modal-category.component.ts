import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CategoryRequest } from '../../../models/categorias/category-request.interface';
import { CategoryService } from '../../../services/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-category',
  imports: [FormsModule],
  templateUrl: './modal-category.component.html',
  styleUrl: './modal-category.component.css'
})
export class ModalCategoryComponent implements OnInit {


  ngOnInit(): void {
        if (this.isEditMode && this.categoryToEdit) {
            this.nome     = this.categoryToEdit.nome;
            this.position = this.categoryToEdit.position;
            this.categoryId = this.categoryToEdit.id; 
      } else {
           this.reset();
      }
  }

  private categoryService = inject(CategoryService);
  private categoryId?: number;

  @Input() isEditMode = false;         
  @Input() categoryToEdit?: any;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
 

  nome = '';
  position: number | null = null;
  isSaving = signal(false);
  errorMessage = '';

  onCancel() {
    if (this.isSaving()) return;
    this.close.emit();
  }

 

 async onSave() {

    if (this.isSaving() || !this.nome.trim()) return;

    this.isSaving.set(true);
    this.errorMessage = '';

    try {
      const request: CategoryRequest = {
        nome: this.nome.trim(),
        position: this.position
      };

      if (this.isEditMode && this.categoryId) {
        await this.categoryService.updateCategory(this.categoryId, request).toPromise();
      } else {
        await this.categoryService.addCategory(request).toPromise();
      }

      this.saved.emit();
      this.close.emit();

    } catch (error: any) {
      this.errorMessage = error?.error?.message || 
        `Não foi possível ${this.isEditMode ? 'atualizar' : 'criar'} a categoria.`;
    } finally {
      this.isSaving.set(false);
    }
}

  reset() {
    this.nome = '';
    this.position = null;
    this.errorMessage = '';
  }

}
