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
  comments: string[] = []; 

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn$;
    this.loadComments();
  }

  loadComments() {
    this.http.get<string[]>('http://localhost:3001/comments')
      .subscribe(
        data => this.comments = data,
        error => console.error('Erro ao carregar comentários', error)
      );
  }

  postComment() {
    if (!this.newComment.trim()) return;
   
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
