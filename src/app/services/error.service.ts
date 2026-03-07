import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  getApiErrorMessage(err: any): string {
    if (!(err instanceof HttpErrorResponse)) {
      return 'Erro de conexão ou inesperado.';
    }

    const body = err.error;

    if (!body) return 'Erro desconhecido do servidor.';

    if (typeof body === 'string') return body;

    return body.erro
}
}
