import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   private readonly BASE_API: string = API_BASE_URL;

  constructor(private http: HttpClient,private authService: AuthService) {}

   copyProduct(productId: number): Observable<any> {
        return this.http.post<any>(`${this.BASE_API}/produtos/clone/${productId}`,null, {
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
