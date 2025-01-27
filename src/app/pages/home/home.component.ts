import { Component } from '@angular/core';
import { ImageGalleryComponent } from '../../image-gallery/image-gallery.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ImageGalleryComponent, UserProfileComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  handleNotification(event: string) {
    console.log('Notificação recebida:', event);
  }
}
