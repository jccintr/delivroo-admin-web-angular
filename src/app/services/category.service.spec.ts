import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { CategoryResponse } from '../models/categorias/category-reponse.interface';
import { CategoryRequest } from '../models/categorias/category-request.interface';
import { ProdutosCategory } from '../models/categorias/produtos-category.interface';
import { signal } from '@angular/core';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  let authServiceMock: any;


  const mockToken = 'fake-jwt-token-12345';

  
  
  const newCategoryRequest: CategoryRequest = {
    nome: 'Nova Categoria',
    position: 2
  };

  const updatedCategoryRequest: CategoryRequest = {
    nome: 'Categoria Atualizada',
    position: 2
  };

  const mockProduct1: ProdutosCategory = {
    id: 1,
    user_id: 2,
    categoria_id: 1,
    nome: "Produto 1",
    descricao: "Descrição do Produto 1",
    imagem: "imagem1.jpg",
    preco: "10.99",
    ativo: true,
    pizza: false
  }

  const mockProduct2: ProdutosCategory = {
    id: 2,
    user_id: 2,
    categoria_id: 1,
    nome: "Produto 2",
    descricao: "Descrição do Produto 2",
    imagem: "imagem2.jpg",
    preco: "15.99",
    ativo: true,
    pizza: false
  }

  const mockCategoryResponse: CategoryResponse = {
     id: 1,
     user_id: 2,
     nome: "Sobremesas",
     position: 3,
     produtos: [mockProduct1, mockProduct2]
  };

  const mockCategories: CategoryResponse[] = [
    {
     id: 1,
     user_id: 2,
     nome: "Sobremesas",
     position: 3,
     produtos: [mockProduct1, mockProduct2]
    }
  ];

 beforeEach(() => {
    // Mock simples e compatível com Signals
    authServiceMock = {
      token: signal(mockToken)   // cria um signal real
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CategoryService,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get categories with correct headers', () => {
   

    service.getCategories().subscribe(response => {
      expect(response).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${(service as any).BASE_API}/categorias`);

    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush(mockCategories);
  });

  it('should add category', () => {
   // const mockRequest: CategoryRequest = { name: 'Nova', description: 'Teste' };

    service.addCategory(newCategoryRequest).subscribe();

    const req = httpMock.expectOne(`${(service as any).BASE_API}/categorias`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.body).toEqual(newCategoryRequest);
    expect(req.request.body.nome).toBe('Nova Categoria');
    req.flush({ success: true });
  });

  it('should update category', () => {
    const categoryId = 5;
    service.updateCategory(categoryId, updatedCategoryRequest).subscribe();

    const req = httpMock.expectOne(`${(service as any).BASE_API}/categorias/${categoryId}`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    expect(req.request.body).toEqual(updatedCategoryRequest);
    expect(req.request.body.nome).toBe('Categoria Atualizada');

    req.flush({ success: true });
  });

  it('should delete category', () => {
    const categoryId = 10;
    service.deleteCategory(categoryId).subscribe();

    const req = httpMock.expectOne(`${(service as any).BASE_API}/categorias/${categoryId}`);

    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

    req.flush({ success: true });
  });

  it('should handle error when updating non-existent category', () => {
  const invalidId = 99999;
  
  service.updateCategory(invalidId, updatedCategoryRequest).subscribe({
    next: () => fail('Deveria ter dado erro'),
    error: (error) => {
      expect(error.status).toBe(404); // ou 400, dependendo da sua API
    }
  });

  const req = httpMock.expectOne(`${(service as any).BASE_API}/categorias/${invalidId}`);
  expect(req.request.method).toBe('PUT');

  // Simula resposta de erro do backend
  req.flush('Category not found', { 
    status: 404, 
    statusText: 'Not Found' 
  });
});

it('should handle error when delete non-existent category', () => {
  const invalidId = 99999;
  
  service.deleteCategory(invalidId).subscribe({
    next: () => fail('Deveria ter dado erro'),
    error: (error) => {
      expect(error.status).toBe(404); // ou 400, dependendo da sua API
    }
  });

  const req = httpMock.expectOne(`${(service as any).BASE_API}/categorias/${invalidId}`);
  expect(req.request.method).toBe('DELETE');

  // Simula resposta de erro do backend
  req.flush('Category not found', { 
    status: 404, 
    statusText: 'Not Found' 
  });
});

  
});
