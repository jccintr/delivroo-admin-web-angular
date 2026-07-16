import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LoginResponse } from '../models/auth/login-response.interface';

describe('AuthService', () => {
  let service: AuthService;
  
  const mockUser: LoginResponse = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null user (não autenticado)', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.token()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should set user correctly', () => {
    service.setUser(mockUser);
    expect(service.currentUser()).toEqual(mockUser);
    expect(service.token()).toBe('abc123.jwt.token');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should update computed signals when user changes', () => {
    // Inicialmente null
    expect(service.isAuthenticated()).toBeFalse();
    expect(service.token()).toBeNull();

    service.setUser(mockUser);
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.token()).toBe(mockUser.token);

    // Logout
    service.logout();
    expect(service.currentUser()).toBeNull();
    expect(service.token()).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should handle logout correctly', () => {
    service.setUser(mockUser);
    expect(service.isAuthenticated()).toBeTrue();

    service.logout();
    expect(service.isAuthenticated()).toBeFalse();
  });

});
