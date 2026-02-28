import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { PaymentResponse } from '../models/pagamentos/payment-response.interface';
import { PagamentoRequest } from '../models/pagamentos/pagamento-request.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly BASE_API: string = API_BASE_URL;

  constructor(private http: HttpClient,private authService: AuthService) {}

  getPayments() : Observable<PaymentResponse[]> {
    return this.http.get<PaymentResponse[]>(`${this.BASE_API}/pagamentos`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.token()
      },
    }); 
  }

  addPayment(payment: PagamentoRequest): Observable<any> {
        return this.http.post<any>(`${this.BASE_API}/pagamentos`, payment, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authService.token()
          },
        }); 
      }

  updatePayment(paymentId: number, payment: PagamentoRequest): Observable<any> {
        return this.http.put<any>(`${this.BASE_API}/pagamentos/${paymentId}`, payment, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authService.token()
          },
        }); 
      }

  deletePayment(paymentId: number): Observable<any> {
      return this.http.delete<any>(`${this.BASE_API}/pagamentos/${paymentId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
    }
}
