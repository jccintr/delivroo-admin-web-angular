import { Component, signal } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../models/auth/login-response.interface';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  showPassword = false;
  email = signal<string>('');
  password = signal<string>('');
  errorMessage: string | null = null;
  loginResponse: LoginResponse | null = null;
  isLoading = signal<boolean>(false);
  year = new Date().getFullYear();

   constructor(private storeService: StoreService,private router: Router,private authService: AuthService) {
   }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onLogin(): Promise<void> {
     this.errorMessage = null;
     console.log('Login button clicked');
     console.log('Email:', this.email());
     console.log('Password:', this.password());
     if(!this.email() || !this.password()) {
          this.errorMessage = 'Por favor, preencha todos os campos.';  
          return;  
     }

   this.isLoading.set(true);
   try {
      this.loginResponse = await firstValueFrom(this.storeService.login({ email: this.email(), password: this.password() }));
      this.authService.setUser(this.loginResponse);
      this.email.set('');
      this.password.set('');
      this.router.navigate(['/dashboard'], { replaceUrl: true });
      console.log('Login successful:', this.loginResponse);
      console.log('Login response:', this.loginResponse);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      this.errorMessage = 'E-mail e ou senha inválidos.';
    } finally {
      this.isLoading.set(false);
    }
  }

  }

  
  