import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent {
  private http = inject(HttpClient);
  userId: string | null = null;

  user = { nome: '', email: '', password: '', confirmPassword: '' };
  usuarios: Array<{ nome: string; email: string }> = [];
  passwordMismatch = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    const storedUsers = localStorage.getItem('usuarios');
    if (storedUsers) {
      this.usuarios = JSON.parse(storedUsers);
    }
  }

  async onSubmit() {
    if (this.user.password !== this.user.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;

    const newUser = { nome: this.user.nome, email: this.user.email };

    this.usuarios.push(newUser);
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));


    try {
      const response = await this.http.post("http://localhost:3000/usuarios", newUser).toPromise();
      console.log("Usuário cadastrado com sucesso:", response);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    }

    this.user = { nome: '', email: '', password: '', confirmPassword: '' };
  }

  removeUser(index: number) {
    this.usuarios.splice(index, 1);
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }
}
