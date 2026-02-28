import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../models/categorias/category-reponse.interface';
import { CategoryRequest } from '../models/categorias/category-request.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly BASE_API: string = API_BASE_URL;

  constructor(private http: HttpClient,private authService: AuthService) {}

   getCategories(): Observable<CategoryResponse[]> {
      return this.http.get<CategoryResponse[]>(`${this.BASE_API}/categorias`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
    }

    addCategory(category: CategoryRequest): Observable<any> {
      return this.http.post<any>(`${this.BASE_API}/categorias`, category, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
    }

    updateCategory(categoryId: number, category: CategoryRequest): Observable<any> {
      return this.http.put<any>(`${this.BASE_API}/categorias/${categoryId}`, category, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
    }

    deleteCategory(categoryId: number): Observable<any> {
      return this.http.delete<any>(`${this.BASE_API}/categorias/${categoryId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
    }
}
