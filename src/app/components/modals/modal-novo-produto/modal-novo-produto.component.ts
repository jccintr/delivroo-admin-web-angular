import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { CategoryResponse } from '../../../models/categorias/category-reponse.interface';
import { CategoryService } from '../../../services/category.service';
import { ProductService } from '../../../services/product.service';
import { AddProductRequest } from '../../../models/produtos/add-product-request.interface';

@Component({
  selector: 'app-modal-novo-produto',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-novo-produto.component.html',
  styleUrl: './modal-novo-produto.component.css'
})
export class ModalNovoProdutoComponent implements OnInit {

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  @Input() isEditMode = false;           // futuro: se quiser suportar edição
  @Input() productToEdit?: any;          // futuro
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  // Form fields
  nome = '';
  descricao = '';
  preco: number | null = null;
  categoria_id: number | null = null;
  imagem: File | null = null;
  imagemPreview: string | null = null;

  categorias: CategoryResponse[] = [];
  loadingCategorias = false;

  isSaving = signal(false);
  errorMessage = '';

  ngOnInit(): void {
    this.loadCategorias();
    // Se futuramente implementar edição, popular campos aqui
  }

  async loadCategorias() {
    this.loadingCategorias = true;
    try {
      this.categorias = await firstValueFrom(this.categoryService.getCategories());
    } catch (err) {
      console.error('Erro ao carregar categorias para o modal', err);
      this.errorMessage = 'Não foi possível carregar as categorias.';
    } finally {
      this.loadingCategorias = false;
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

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagemPreview = reader.result as string;
      };
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
        reader.onload = () => {
          this.imagemPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.errorMessage = 'Apenas arquivos de imagem são permitidos.';
      }
    }
  }

  removeImage(): void {
    this.imagem = null;
    this.imagemPreview = null;
  }

  async onSave() {
    if (this.isSaving() || !this.nome.trim() || !this.categoria_id || this.preco === null || this.preco <= 0) {
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
        imagem: this.imagem
      };

      await firstValueFrom(this.productService.addProduct(request));

      this.saved.emit();
      this.close.emit();

    } catch (error: any) {
      this.errorMessage = error?.error?.message || 
        'Não foi possível criar o produto. Tente novamente.';
      console.error('Erro ao salvar produto:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  onCancel() {
    if (this.isSaving()) return;
    this.close.emit();
  }

  resetForm() {
    this.nome = '';
    this.descricao = '';
    this.preco = null;
    this.categoria_id = null;
    this.imagem = null;
    this.imagemPreview = null;
    this.errorMessage = '';
  }

}
