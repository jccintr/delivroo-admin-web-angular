import { Injectable } from '@angular/core';
import { TaxResponse } from '../models/taxas/tax-response.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { AuthService } from './auth.service';
import { TaxRequest } from '../models/taxas/tax-request.interface';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

   private readonly BASE_API: string = API_BASE_URL;

  constructor(private http: HttpClient,private authService: AuthService) {}

  getTax() : Observable<TaxResponse[]> {
    return this.http.get<TaxResponse[]>(`${this.BASE_API}/taxas`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.token()
      },
    }); 
  }

   addTax(tax: TaxRequest): Observable<TaxResponse> {
          return this.http.post<TaxResponse>(`${this.BASE_API}/taxas`, tax, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.authService.token()
            },
          }); 
        }
  
    updateTax(taxId: number, tax: TaxRequest): Observable<TaxResponse> {
          return this.http.put<TaxResponse>(`${this.BASE_API}/taxas/${taxId}`, tax, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + this.authService.token()
            },
          }); 
        }
}
