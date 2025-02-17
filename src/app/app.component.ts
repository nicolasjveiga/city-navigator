  import { Component } from '@angular/core';
  import { RouterOutlet } from '@angular/router';
  import { HeaderComponent } from './header/header.component';
  import { FooterComponent } from './footer/footer.component';
  import { ImageGalleryComponent } from './image-gallery/image-gallery.component';
  import { RouterLink, RouterLinkActive } from '@angular/router';
  import { PlaceDetailsComponent } from './pages/place-details/place-details.component';

  @Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent, ImageGalleryComponent, PlaceDetailsComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
  })
  export class AppComponent {
    title = 'city-navigator';
  }
