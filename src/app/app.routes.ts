import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PlaceDetailsComponent } from './pages/place-details/place-details.component';
import { CommentsComponent } from './comments/comments.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard.service';
import { FavoritesComponent } from './pages/favorites/favorites.component'; 

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'perfil/:id', component: PerfilComponent },
    { path: 'place-details/:placeId', component: PlaceDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'comments', component: CommentsComponent, canActivate: [AuthGuard] },
    { path: 'favoritos', component: FavoritesComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];