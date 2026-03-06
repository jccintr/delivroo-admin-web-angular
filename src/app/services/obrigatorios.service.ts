import { Injectable } from '@angular/core';
import { ObrigatoriosResponse } from '../models/obrigatorios/obrigatorios-response.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';
import { AuthService } from './auth.service';
import { ObrigatoriosRequest } from '../models/obrigatorios/obrigatorios-request.interface';

@Injectable({
  providedIn: 'root'
})
export class ObrigatoriosService {

  private readonly BASE_API: string = API_BASE_URL;

  constructor(private http: HttpClient,private authService: AuthService) {}

  getObrigatorios() : Observable<ObrigatoriosResponse[]> {
      return this.http.get<ObrigatoriosResponse[]>(`${this.BASE_API}/obrigatorios`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
  }

   addObrigatorio(obrigatorio: ObrigatoriosRequest): Observable<ObrigatoriosResponse> {
      return this.http.post<ObrigatoriosResponse>(`${this.BASE_API}/obrigatorios`, obrigatorio, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
    }

  updateObrigatorio(obrigatorioId: number, obrigatorio: ObrigatoriosRequest): Observable<ObrigatoriosResponse> {
    return this.http.put<ObrigatoriosResponse>(`${this.BASE_API}/obrigatorios/${obrigatorioId}`, obrigatorio, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.token()
      },
    }); 
  }

  deleteObrigatorio(obrigatorioId: number): Observable<any> {
      return this.http.delete<any>(`${this.BASE_API}/obrigatorios/${obrigatorioId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.token()
        },
      }); 
    }
}
