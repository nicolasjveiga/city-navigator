import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  standalone: true
})
export class UserProfileComponent {
  imagemUrl: string = 'assets/images/londres1.jpeg'

  trocarImagem() {
    this.imagemUrl = 
      this.imagemUrl === 'assets/images/londres1.jpeg'
      ? 'assets/images/londres2.webp'
      : 'assets/images/londres1.jpeg'
  }
}
