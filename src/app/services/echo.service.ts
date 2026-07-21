import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { NotificationService } from './notification.service';

declare global {
  interface Window { Pusher: any; Echo: any; }
}

@Injectable({
  providedIn: 'root'
})
export class EchoService {

    echo: any;
  private currentPdvId: string | null = null;

  constructor(private notificationService: NotificationService) {
    window.Pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: '4e8cb06e686c3e0ca5b6',
      cluster: 'sa1',
      forceTLS: true,
    });

    console.log('🔧 Echo Service inicializado');
  }

   subscribeToPdv(pdvId: string | number) {
    const pdvStr = pdvId.toString().trim();

    if (this.currentPdvId === pdvStr) {
      console.log('✅ Já escutando este PDV');
      return;
    }

    // Sair do canal anterior (se houver)
    if (this.currentPdvId) {
      this.echo.leave(`orders.pdv-${this.currentPdvId}`);
    }

    this.currentPdvId = pdvStr;
    const channelName = `orders.pdv-${pdvStr}`;

    console.log(`🔄 Inscrevendo no canal: ${channelName}`);

    this.echo.channel(channelName)
      .listen('NewOrderCreated', (data: any) => {
        console.log('✅ EVENTO RECEBIDO com sucesso!', data);
        this.notificationService.notifyNewOrder(data);   // ← Delegando para o NotificationService
      })
      .listen('.NewOrderCreated', (data: any) => {  // fallback
        console.log('✅ EVENTO com ponto recebido!', data);
        this.notificationService.notifyNewOrder(data);
      });
  }

  unsubscribe() {
    if (this.currentPdvId) {
      this.echo.leave(`orders.pdv-${this.currentPdvId}`);
      this.currentPdvId = null;
    }
  }


}
