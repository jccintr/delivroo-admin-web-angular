import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/auth/login-request.interface';
import { LoginResponse } from '../models/auth/login-response.interface';
import { DashboardResponse } from '../models/dashboard/dashboard-response.interface';
import { AuthService } from './auth.service';
import { UpdateWaitTimeRequest } from '../models/dashboard/updateWaitTime-request.interface';
import { UpdateWaitTimeResponse } from '../models/dashboard/updateWaitTime-response';
import { toggleStatusResponse } from '../models/dashboard/toggleStatus-response.interface';
import { PedidosResponse } from '../models/pedidos/pedidos-response.interface';
import { StatusPedido } from '../models/pedidos/stsatus-pedido.interface';
import { API_BASE_URL, STORAGE_BASE_URL} from '../constants/api.constants';




@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private readonly BASE_API: string = API_BASE_URL;
  private readonly BASE_STORAGE: string = STORAGE_BASE_URL;
  
 
  constructor(private http: HttpClient,private authService: AuthService) {}

   login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<any>(
      `${this.BASE_API}/auth/login`,
      loginRequest,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  }

  getDashboardData(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.BASE_API}/pedidosresumo`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.token()
      },
    }); 
  }

  getPedidos(): Observable<PedidosResponse[]> {
      return this.http.get<PedidosResponse[]>(`${this.BASE_API}/pedidos`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
  }

  getStatus(): Observable<StatusPedido[]> {
    return this.http.get<StatusPedido[]>(`${this.BASE_API}/status`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.token()
      },
    }); 
  }

  

  addStatusLog(pedido_id: number, status_pedido_id: number): Observable<any> {
    return this.http.post<any>(
      `${this.BASE_API}/statuslog`,
      {
        pedido_id: pedido_id,
        status_pedido_id: status_pedido_id
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        }
      }
    );
  }

  getWaitTime(){
    return this.authService.currentUser()?.tempo_espera ?? '30 a 45 min';
  }

 getIsOpen(){
    return this.authService.currentUser()?.aberto ?? true;
  }

  updateWaitTime(request: UpdateWaitTimeRequest):  Observable<UpdateWaitTimeResponse> {
     return this.http.post<any>(
      `${this.BASE_API}/espera`,
      request,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        }
      }
    );
  }

  toggleStoreStatus(): Observable<toggleStatusResponse> {
    return this.http.post<any>(
      `${this.BASE_API}/status`,
      {},
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        }
      }
    );
  }

}
