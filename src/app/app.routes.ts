import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { CardapioComponent } from './pages/cardapio/cardapio.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';

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
      }
    ]
   }, 
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
 
   
];
