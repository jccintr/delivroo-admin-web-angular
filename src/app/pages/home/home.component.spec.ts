import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';

import { HomeComponent } from './home.component';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';
import { STORAGE_BASE_URL } from '../../constants/api.constants';
import { LoginResponse } from '../../models/auth/login-response.interface';

// Usuário mock completo, batendo com a interface LoginResponse
const mockUser: LoginResponse = {
  id: 1,
  name: 'Loja Teste',
  email: 'teste@example.com',
  email_verified_at: null,
  role: 1,
  push_token: null,
  slug: 'loja-teste',
  telefone: '123456789',
  ativo: true,
  aberto: true,
  logotipo: 'logo.png',
  logradouro: 'Rua Teste',
  bairro: 'Bairro Teste',
  cidade_id: 1,
  estado: null,
  chave_pix: null,
  favorecido_pix: null,
  cor_fundo: null,
  cor_texto: null,
  tempo_espera: '30',
  opened_at: null,
  cidade: 'Cidade Teste',
  token: 'abc123.jwt.token'
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated'], {
      currentUser: signal<LoginResponse | null>(null)
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: StoreService, useValue: {} }
      ]
    })
      // Substitui o SidebarComponent real por um "shell" vazio no template,
      // assim o teste não depende de nenhuma lógica interna do sidebar.
      .overrideComponent(HomeComponent, {
        set: { template: '<router-outlet></router-outlet>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit - autenticação', () => {
    it('should redirect to /login when user is not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);

      component.ngOnInit();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    });

    it('should NOT redirect when user is authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.currentUser.set(mockUser);

      component.ngOnInit();

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit - dados do usuário', () => {
    it('should set storeName and logotipo from currentUser when authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.currentUser.set(mockUser);

      component.ngOnInit();

      expect(component.storeName).toBe('Loja Teste');
      expect(component.logotipo).toBe(`${STORAGE_BASE_URL}/logo.png`);
    });

    it('should set storeName to null when currentUser is null', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.currentUser.set(null);

      component.ngOnInit();

      expect(component.storeName).toBeNull();
    });

    it('should still build a logotipo URL prefix even when currentUser is null', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.currentUser.set(null);

      component.ngOnInit();

      // logotipo vira `${STORAGE_BASE_URL}/undefined` neste caso -
      // documentando o comportamento atual do componente.
      expect(component.logotipo).toContain(STORAGE_BASE_URL);
    });

    it('should handle logotipo being null on an authenticated user', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.currentUser.set({ ...mockUser, logotipo: null });

      component.ngOnInit();

      expect(component.logotipo).toBe(`${STORAGE_BASE_URL}/null`);
    });
  });

  describe('ngOnInit - caso não autenticado + leitura de dados (comportamento atual)', () => {
    it('should redirect but still attempt to read storeName/logotipo (no early return in component)', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      authServiceSpy.currentUser.set(null);

      component.ngOnInit();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      expect(component.storeName).toBeNull();
    });
  });
});