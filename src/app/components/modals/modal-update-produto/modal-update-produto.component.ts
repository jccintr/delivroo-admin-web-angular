import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { STORAGE_BASE_URL } from '../../../constants/api.constants';
import { CategoryResponse } from '../../../models/categorias/category-reponse.interface';
import { AddProductRequest } from '../../../models/produtos/add-product-request.interface';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-modal-update-produto',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-update-produto.component.html',
  styleUrl: './modal-update-produto.component.css'
})
export class ModalUpdateProdutoComponent implements OnInit {

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  @Input() productToEdit?: any;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  // Form fields
  nome = '';
  descricao = '';
  preco: number | null = null;
  categoria_id: number | null = null;
  imagem: File | null = null;           // nova imagem (só envia se alterada)
  productId?: number;

  // Preview
  currentImageUrl: string | null = null;
  newImagePreview: string | null = null;

  categorias: CategoryResponse[] = [];
  loadingCategorias = false;

  isSaving = signal(false);
  errorMessage = '';

  ngOnInit(): void {
    this.loadCategorias();
    this.populateForm();
  }

  private populateForm(): void {
    if (!this.productToEdit) return;

    this.productId = this.productToEdit.id;
    this.nome = this.productToEdit.nome || '';
    this.descricao = this.productToEdit.descricao || '';
    this.preco = this.productToEdit.preco ? Number(this.productToEdit.preco) : null;
    this.categoria_id = this.productToEdit.categoria_id || null;

    if (this.productToEdit.imagem) {
      this.currentImageUrl = `${STORAGE_BASE_URL}/${this.productToEdit.imagem}`;
    }
  }

  async loadCategorias() {
    this.loadingCategorias = true;
    try {
      this.categorias = await firstValueFrom(this.categoryService.getCategories());
    } catch (err) {
      console.error('Erro ao carregar categorias', err);
      this.errorMessage = 'Não foi possível carregar as categorias.';
    } finally {
      this.loadingCategorias = false;
    }
  }

  triggerFileInput(): void {
  const input = document.getElementById('fileInputUpdate') as HTMLInputElement;
  if (input) {
    input.click();
  }
}
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Por favor, selecione uma imagem válida.';
        return;
      }
      this.imagem = file;

      const reader = new FileReader();
      reader.onload = () => this.newImagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.imagem = file;
        const reader = new FileReader();
        reader.onload = () => this.newImagePreview = reader.result as string;
        reader.readAsDataURL(file);
      } else {
        this.errorMessage = 'Apenas arquivos de imagem são permitidos.';
      }
    }
  }

  cancelNewImage(): void {
    this.imagem = null;
    this.newImagePreview = null;
  }

  async onSave() {
    if (this.isSaving() || !this.nome.trim() || !this.categoria_id || this.preco === null || this.preco <= 0 || !this.productId) {
      this.errorMessage = 'Preencha todos os campos obrigatórios corretamente.';
      return;
    }

    this.isSaving.set(true);
    this.errorMessage = '';

    try {
      const request: AddProductRequest = {
        nome: this.nome.trim(),
        descricao: this.descricao.trim(),
        preco: this.preco,
        categoria_id: this.categoria_id,
        imagem: this.imagem   // null = mantém a imagem atual
      };

      await firstValueFrom(this.productService.updateProduct(this.productId, request));

      this.saved.emit();
      this.close.emit();

    } catch (error: any) {
      this.errorMessage = error?.error?.message || 
        'Não foi possível atualizar o produto. Tente novamente.';
      console.error('Erro ao atualizar produto:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel() {
    if (this.isSaving()) return;
    this.close.emit();
  }

}
