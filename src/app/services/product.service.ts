import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { AddProductRequest } from '../models/produtos/add-product-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   private readonly BASE_API: string = API_BASE_URL;

  constructor(private http: HttpClient,private authService: AuthService) {}

   addProduct(product: AddProductRequest): Observable<any> {

      const formData = new FormData();
      formData.append('nome', product.nome);
      formData.append('descricao', product.descricao);
      formData.append('preco', product.preco.toString());      
      formData.append('categoria_id', product.categoria_id.toString());
      if (product.imagem) {
        formData.append('imagem', product.imagem, product.imagem.name);
      }
      return this.http.post<any>(`${this.BASE_API}/produtos`, formData, {
        headers: {
          Accept: 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      });
      
 }

 updateProduct(productId: number,product: AddProductRequest): Observable<any> {

      const formData = new FormData();
      formData.append('nome', product.nome);
      formData.append('descricao', product.descricao);
      formData.append('preco', product.preco.toString());      
      formData.append('categoria_id', product.categoria_id.toString());
      if (product.imagem) {
        formData.append('imagem', product.imagem, product.imagem.name);
      }
      return this.http.post<any>(`${this.BASE_API}/produtos/update/${productId}`, formData, {
        headers: {
          Accept: 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      });
      
 }

  copyProduct(productId: number): Observable<any> {
        return this.http.post<any>(`${this.BASE_API}/produtos/clone/${productId}`,null, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authService.token()
          },
        }); 
  }

  toggleAtivo(productId: number): Observable<any> {
        return this.http.put<any>(`${this.BASE_API}/produtos/toggleativo/${productId}`,null, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authService.token()
          },
        }); 
  }


   deleteProduct(productId: number): Observable<any> {
      return this.http.delete<any>(`${this.BASE_API}/produtos/${productId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
  }
}
