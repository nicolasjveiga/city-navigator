import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template:`
    <div class="p-4 border rounded shadow">
      <p>Bem-vindo, {{ userName }}!</p>
      <button (click)="notifyParent()">Notificar Pai</button>
    </div>
    `,
    
  styles: []
})
export class UserProfileComponent {
  @Input() userName: string = '';
  @Output() notification = new EventEmitter<string>();

  notifyParent() {
    this.notification.emit('Botão de perfil foi clicado');
  }
}
