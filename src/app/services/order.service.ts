import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../constants/api.constants';
import { AuthService } from './auth.service';
import { PedidosResponse } from '../models/pedidos/pedidos-response.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

   private readonly BASE_API: string = API_BASE_URL;

   constructor(private http: HttpClient,private authService: AuthService) {}

   getMonthReport(month:number,year:number) : Observable<PedidosResponse[]> {
       return this.http.get<PedidosResponse[]>(`${this.BASE_API}/pedidos/${year}/${month}`, {
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
           'Authorization': 'Bearer ' + this.authService.token()
         },
       }); 
     }
}
