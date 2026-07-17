import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginResponse } from '../../models/auth/login-response.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let storeServiceSpy: jasmine.SpyObj<StoreService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockLoginResponse: LoginResponse = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      email_verified_at: null,
      role: 1,
      push_token: null,
      slug: 'test-user',
      telefone: '123456789',
      ativo: true,
      aberto: true,
      logotipo: null,
      logradouro: 'Test Address',
      bairro: 'Test Neighborhood',
      cidade_id: 1,
      estado: null,
      chave_pix: null,
      favorecido_pix: null,
      cor_fundo: null,
      cor_texto: null,
      tempo_espera: '30',
      opened_at: null,
      cidade: 'Test City',
      token: 'abc123.jwt.token'
  };

   beforeEach(async () => {
    storeServiceSpy = jasmine.createSpyObj('StoreService', ['login']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['setUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent], // como é standalone
      providers: [
        { provide: StoreService, useValue: storeServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('should show error if email or password is empty', () => {
    component.email.set('');
    component.password.set('');
    component.onLogin();

    expect(component.errorMessage).toBe('Por favor, preencha todos os campos.');
    expect(storeServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should login successfully', async () => {
    storeServiceSpy.login.and.returnValue(of(mockLoginResponse));

    component.email.set('test@delivroo.com');
    component.password.set('123456');

    await component.onLogin();

    expect(storeServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@delivroo.com',
      password: '123456'
    });

    expect(authServiceSpy.setUser).toHaveBeenCalledWith(mockLoginResponse);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard'], { replaceUrl: true });
    expect(component.errorMessage).toBeNull();
    expect(component.isLoading()).toBeFalse();
  });

 it('should handle login error and show message', async () => {
  const errorMock = new Error('Invalid credentials');
  storeServiceSpy.login.and.returnValue(throwError(() => errorMock));

  spyOn(console, 'error'); // silencia o erro no console

  component.email.set('test@delivroo.com');
  component.password.set('senhaerrada');

  await component.onLogin();

  expect(component.errorMessage).toBe('E-mail e ou senha inválidos.');
  expect(authServiceSpy.setUser).not.toHaveBeenCalled();
  expect(routerSpy.navigate).not.toHaveBeenCalled();
});

  it('should set loading to true during login', async () => {
    storeServiceSpy.login.and.returnValue(of(mockLoginResponse));

    component.email.set('test@test.com');
    component.password.set('123');

    const promise = component.onLogin();

    expect(component.isLoading()).toBeTrue();

    await promise;
    expect(component.isLoading()).toBeFalse();
  });


 
});
