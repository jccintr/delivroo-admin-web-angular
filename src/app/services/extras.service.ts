import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { ExtrasResponse } from '../models/adicionais/extras-response.interface';
import { ExtrasRequest } from '../models/adicionais/extras-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ExtrasService {
  
  private readonly BASE_API: string = API_BASE_URL;

  constructor(private http: HttpClient,private authService: AuthService) {}

  getExtras() : Observable<ExtrasResponse[]> {
      return this.http.get<ExtrasResponse[]>(`${this.BASE_API}/adicionais`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
  }

  addExtra(extra: ExtrasRequest): Observable<any> {
          return this.http.post<any>(`${this.BASE_API}/adicionais`, extra, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.authService.token()
            },
          }); 
  }

  updateExtra(extraId: number, extra: ExtrasRequest): Observable<any> {
          return this.http.put<any>(`${this.BASE_API}/adicionais/${extraId}`, extra, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.authService.token()
            },
          }); 
  }

  deleteExtra(extraId: number): Observable<any> {
      return this.http.delete<any>(`${this.BASE_API}/adicionais/${extraId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
    }
}
