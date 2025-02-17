import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header>
      <nav class="navbar bg-ciano shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
          <a class="btn text-white btn-ghost normal-case text-xl" routerLink="/">CityNavigator</a>
          <div class="flex lg:hidden">
            <button class="btn btn-square btn-ghost" data-collapse-toggle="navbar">
              <i class="bi bi-list"></i>
            </button>
          </div>
          <div class="hidden lg:flex">
            <ul class="menu bg-ciano text-white menu-horizontal px-1">
              <li>
                <a routerLink="/" routerLinkActive="text-white bg-ciano">Home</a>
              </li>
              <!-- Se não estiver logado, exibe Login e Cadastro -->
              <ng-container *ngIf="!(isLoggedIn$ | async)">
                <li>
                  <a routerLink="/login" routerLinkActive="text-white bg-ciano">Login</a>
                </li>
                <li>
                  <a routerLink="/perfil" routerLinkActive="text-white bg-ciano">Cadastro</a>
                </li>
              </ng-container>
              <!-- Se estiver logado, exibe Perfil, Favoritos e Logout -->
              <ng-container *ngIf="isLoggedIn$ | async">
                <li>
                  <a routerLink="/perfil" routerLinkActive="text-white bg-ciano">Perfil</a>
                </li>
                <li>
                  <a routerLink="/favoritos" routerLinkActive="text-white bg-ciano">Favoritos</a>
                </li>
                <li>
                  <a (click)="logout()" class="cursor-pointer">Logout</a>
                </li>
              </ng-container>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  `,
})
export class HeaderComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  logout() {
    this.authService.logout();
  }
}