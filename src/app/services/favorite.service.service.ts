
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<any[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

 
  loadFavorites(userId: string) {
    this.http.get<any[]>(`http://localhost:3001/favorites?userId=${userId}`).subscribe(
      (favorites) => this.favoritesSubject.next(favorites),
      (error) => console.error('Erro ao carregar favoritos:', error)
    );
  }

  
  addFavorite(userId: string, place: any) {
    return this.http.post('http://localhost:3001/favorites', { userId, ...place });
  }


  removeFavorite(favoriteId: string) {
    return this.http.delete(`http://localhost:3001/favorites/${favoriteId}`);
  }
}