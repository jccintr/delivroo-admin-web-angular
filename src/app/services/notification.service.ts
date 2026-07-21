import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private newOrderSubject = new BehaviorSubject<any>(null);
  public newOrder$ = this.newOrderSubject.asObservable();
  private audio = new Audio('/new-order.wav');

   constructor() {
    this.audio.volume = 0.8;
  }

   notifyNewOrder(order: any) {
    console.log('🛎 Notificação de novo pedido:', order);
    this.newOrderSubject.next(order);
    this.playSound();
    this.showToast(order);
  }

  private playSound() {
    this.audio.currentTime = 0;
    this.audio.play().catch(err => {
      console.warn('Não foi possível tocar o som:', err);
    });
  }

    private showToast(order: any) {
    const customer = order.customer || 'Cliente';
    const total = order.total ? order.total.toFixed(2).replace('.', ',') : '0,00';

    const message = `
      <strong>Novo Pedido Recebido!</strong><br><br>
      Recebemos um pedido de <strong>${customer}</strong><br>
      no valor de <strong>R$ ${total}.</strong>
    `;

    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 30px;
      right: 30px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 20px 28px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      min-width: 320px;
      max-width: 380px;
      line-height: 1.5;
      border: 1px solid rgba(255,255,255,0.2);
    `;

    toast.innerHTML = message;

    document.body.appendChild(toast);

    // Remove automaticamente após 7 segundos
    setTimeout(() => {
      toast.style.transition = 'all 0.4s ease-out';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 400);
    }, 7000);
  }


}
