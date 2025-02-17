import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorite.service.service';

@Component({
  selector: 'app-place-details',
  standalone: true,
  templateUrl: './place-details.component.html',
  imports: [CommonModule, FormsModule],
})
export class PlaceDetailsComponent implements OnInit {
  placeDetails: any = null;
  errorMessage: string = '';
  safeDescription: SafeHtml = '';
  isFavorito: boolean = false;
  newComment: string = '';
  rating: number = 0;
  comments: any[] = [];
  isLoggedIn: boolean = false;
  placeId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private authService: AuthService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.placeId = this.route.snapshot.paramMap.get('placeId');
    const placeName = this.route.snapshot.queryParamMap.get('name');
    const photo = this.route.snapshot.queryParamMap.get('photo') || undefined;

    if (this.placeId && placeName) {
      this.fetchPlaceDetails(this.placeId, placeName, photo);
      this.loadComments(); // Carrega os comentários do lugar
    }

    // Verifica se o usuário está logado
    this.authService.isLoggedIn$.subscribe((isLogged) => {
      this.isLoggedIn = isLogged;
    });

    // Carrega os favoritos do usuário, se estiver logado
    const user = this.authService.getUser();
    if (user) {
      this.favoritesService.loadFavorites(user.id);
      this.favoritesService.favorites$.subscribe((favorites) => {
        // Verifica se o lugar atual está nos favoritos do usuário
        this.isFavorito = favorites.some((fav) => fav.placeId === this.placeId);
      });
    }
  }

  setRating(star: number) {
    this.rating = star;
  }

  fetchPlaceDetails(placeId: string, placeName: string, photo?: string) {
    const url = `http://localhost:3000/place-details/${placeId}?name=${encodeURIComponent(placeName)}`;
    console.log('Buscando detalhes em:', url);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log('Dados recebidos:', data);
        this.placeDetails = data && data.details ? data.details : {};
        if (photo) {
          this.placeDetails.photo = photo;
        }
        if (this.placeDetails && this.placeDetails.description) {
          this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.placeDetails.description);
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar detalhes:', error);
        this.errorMessage = 'Erro ao carregar detalhes do lugar.';
      });
  }

  loadComments() {
    if (!this.placeId) return;
    this.http
      .get<any[]>(`http://localhost:3000/comments?placeId=${this.placeId}`)
      .subscribe(
        (data) => (this.comments = data),
        (error) => console.error('Erro ao carregar comentários:', error)
      );
  }

  postComment() {
    console.log('Tentando postar comentário...');
    if (!this.newComment.trim() || !this.placeId || this.rating < 1 || this.rating > 5) return;

    const user = this.authService.getUser();
    console.log('Usuário recuperado:', user);

    if (!user || !user.username) {
      console.error('Erro: usuário não encontrado');
      return;
    }

    const comment = {
      placeId: this.placeId,
      content: this.newComment.trim(),
      user: user.username,
      rating: this.rating,
    };

    this.http.post('http://localhost:3000/comments', comment).subscribe(
      () => {
        this.newComment = '';
        this.rating = 0; // Resetar a avaliação
        this.loadComments(); // Atualizar os comentários
      },
      (error) => console.error('Erro ao postar comentário:', error)
    );
  }

  abrirStreetView(lat: number, lng: number) {
    const url = `https://www.google.com/maps?q=&layer=c&cbll=${lat},${lng}`;
    window.open(url, '_blank');
  }

  adicionarAosFavoritos(place: any) {
    const user = this.authService.getUser();
    if (!user) {
      console.error('Usuário não está logado.');
      return;
    }

    const placeId = place.id || place.placeId; // Use a propriedade correta
    if (!placeId) {
      console.error('ID do lugar não encontrado.');
      return;
    }

    if (this.isFavorito) {
      // Remove dos favoritos
      this.favoritesService.removeFavorite(placeId).subscribe(
        () => {
          this.isFavorito = false;
          console.log('Removido dos favoritos:', place);
          this.favoritesService.loadFavorites(user.id); // Recarrega a lista de favoritos
        },
        (error) => console.error('Erro ao remover favorito:', error)
      );
    } else {
      // Adiciona aos favoritos
      this.favoritesService.addFavorite(user.id, place).subscribe(
        () => {
          this.isFavorito = true;
          console.log('Adicionado aos favoritos:', place);
          this.favoritesService.loadFavorites(user.id); // Recarrega a lista de favoritos
        },
        (error) => console.error('Erro ao adicionar favorito:', error)
      );
    }
  }

  goBack() {
    window.history.back(); // Volta para a página anterior no histórico do navegador
  }
}
