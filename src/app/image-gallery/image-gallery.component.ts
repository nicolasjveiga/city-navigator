import { Component } from '@angular/core';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  templateUrl: './image-gallery.component.html',
  styleUrl: './image-gallery.component.css',
})
export class ImageGalleryComponent {
  imagemUrl: string = 'assets/images/londres1.jpeg'

  trocarImagem() {
    this.imagemUrl = 
      this.imagemUrl === 'assets/images/londres1.jpeg'
      ? 'assets/images/londres2.webp'
      : 'assets/images/londres1.jpeg'
  }
}
