import { Component, OnInit, signal } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { firstValueFrom } from 'rxjs';
import { DashboardResponse } from '../../models/dashboard/dashboard-response.interface';
import { ModalWaitTimeComponent } from "../../components/modals/modal-wait-time/modal-wait-time.component";

@Component({
  selector: 'app-dashboard',
  imports: [ModalWaitTimeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  dashboardData: DashboardResponse  | undefined;
  lojaAberta = signal<boolean>(true);
  tempoEspera = signal<string>('');
  pedidosRecebidos = signal<number>(0);
  pedidosEntregues = signal<number>(0);
  pedidosRetirados = signal<number>(0);
  faturamentoTotal = signal<number>(0);
  showWaitTimeModal = signal(false);
   loading = true;

  constructor(private storeService: StoreService) { }
  
  async ngOnInit(): Promise<void> {

   try {
         this.dashboardData = await firstValueFrom(this.storeService.getDashboardData());
         this.pedidosRecebidos.set(this.dashboardData.recebidos);
         this.pedidosEntregues.set(this.dashboardData.entregues);
         this.pedidosRetirados.set(this.dashboardData.retirados);
         this.faturamentoTotal.set(this.dashboardData.faturamento);
         this.lojaAberta.set(this.dashboardData.aberto);
         this.tempoEspera.set(this.dashboardData.tempo_espera);
         console.log('Dashboard data:', this.dashboardData);
       } catch (error) {
         console.error('Erro ao carregar dados do dashboard:', error);
       } finally {
          this.loading = false;
        }
     
  }

 

  isOpen(){
    return this.lojaAberta();
  }

  async onToggleStatus(): Promise<void> {
    try {
      const response = await firstValueFrom(this.storeService.toggleStoreStatus());
      this.lojaAberta.set(response.aberto);
      console.log('Status da loja atualizado:', response);
    } catch (error) {
      console.error('Erro ao atualizar status da loja:', error);
    } 
  }

  // Método que abre o modal
  openWaitTimeModal() {
    this.showWaitTimeModal.set(true);
  }

  // Quando o modal salva com sucesso
  onWaitTimeSaved(novoTempo: string) {
    this.tempoEspera.set(novoTempo);
    this.showWaitTimeModal.set(false);
  }

  // Quando cancela ou fecha
  closeWaitTimeModal() {
    this.showWaitTimeModal.set(false);
  }

}
