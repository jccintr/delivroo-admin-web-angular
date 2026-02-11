import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/auth/login-request.interface';
import { LoginResponse } from '../models/auth/login-response.interface';




@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private readonly BASE_API: string = 'https://api.delivroo.app.br/api';
  public readonly BASE_STORAGE: string = 'https://api.delivroo.app.br/storage';
  //private readonly BASE_API: string = 'http://127.0.0.1:8000/api';
  //public readonly BASE_STORAGE: string = 'http://127.0.0.1:8000/storage';
 
  constructor(private http: HttpClient) {}

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

}
