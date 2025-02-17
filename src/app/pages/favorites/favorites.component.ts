// favorites.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorite.service.service';
import { AuthService } from '../../services/auth.service.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites',
  standalone: true, // Certifique-se de que é um componente standalone
  imports: [CommonModule, RouterLink], // Importe os módulos necessários
  templateUrl: './favorites.component.html',
})
export class FavoritesComponent implements OnInit { // Exporte o componente corretamente
  favorites: any[] = [];

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.favoritesService.loadFavorites(user.id);
      this.favoritesService.favorites$.subscribe(
        (favorites) => (this.favorites = favorites)
      );
    }
  }
}