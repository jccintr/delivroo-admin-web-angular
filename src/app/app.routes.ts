import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { CardapioComponent } from './pages/cardapio/cardapio.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { PagamentosComponent } from './pages/pagamentos/pagamentos.component';
import { TaxasComponent } from './pages/taxas/taxas.component';
import { ObrigatoriosComponent } from './pages/obrigatorios/obrigatorios.component';
import { AdicionaisComponent } from './pages/adicionais/adicionais.component';

export const routes: Routes = [
   
     {
    path: '',
    component: HomeComponent,
    children:[
      {
        path: 'dashboard',
        component: DashboardComponent
      },
       {
        path: 'pedidos',
        component: PedidosComponent
      },
       {
        path: 'cardapio',
        component: CardapioComponent
      },
       {
        path: 'categorias',
        component: CategoriasComponent
      },
      {
        path: 'pagamentos',
        component: PagamentosComponent
      },
      {
        path: 'taxas',
        component: TaxasComponent
      },
      {
        path: 'obrigatorios',
        component: ObrigatoriosComponent
      },
      {
        path: 'adicionais',
        component: AdicionaisComponent
      }
    ]
   }, 
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
 
   
];
