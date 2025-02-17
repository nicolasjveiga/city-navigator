// comentarios.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comments',
  standalone: true,
  templateUrl: './comments.component.html',
  imports: [CommonModule, FormsModule]
})
export class CommentsComponent implements OnInit {
  isLoggedIn!: Observable<boolean>;
  newComment: string = '';
  comments: string[] = []; // Em uma aplicação real, isso seria um array de objetos com autor, data, etc.

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    // Assinamos o estado de login para exibir/esconder o formulário
    this.isLoggedIn = this.authService.isLoggedIn$;
    this.loadComments();
  }

  loadComments() {
    // Carrega os comentários do db.json (ou de uma API)
    this.http.get<string[]>('http://localhost:3001/comments')
      .subscribe(
        data => this.comments = data,
        error => console.error('Erro ao carregar comentários', error)
      );
  }

  postComment() {
    if (!this.newComment.trim()) return;
    // Adiciona o comentário via POST (a API simulada com db.json)
    this.http.post('http://localhost:3001/comments', { comment: this.newComment })
      .subscribe(
        () => {
          this.newComment = '';
          this.loadComments();
        },
        error => console.error('Erro ao postar comentário', error)
      );
  }
}
