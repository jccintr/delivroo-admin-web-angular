import { computed, Injectable, signal } from '@angular/core';
import { LoginResponse } from '../models/auth/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser = signal<LoginResponse | null>(null);
  token = computed(() => this.currentUser()?.token ?? null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() { }

  setUser(response: LoginResponse) {
    this.currentUser.set(response);
  }

  logout() {
    this.currentUser.set(null);
  }
}
