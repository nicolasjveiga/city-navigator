import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent {
  userId: string | null = null;

  user = { nome: '', email: '', password: '', confirmPassword: '' }; // Dados do formulário
  usuarios: Array<{ nome: string; email: string }> = []; // Lista de usuários cadastrados
  passwordMismatch = false; // Controle para verificar senhas diferentes

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');

    // Carregar usuários salvos no localStorage
    const storedUsers = localStorage.getItem('usuarios');
    if (storedUsers) {
      this.usuarios = JSON.parse(storedUsers);
    }
  }

  onSubmit() {
    // Verificar se as senhas coincidem
    if (this.user.password !== this.user.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;

    // Salvar usuário na lista
    this.usuarios.push({ nome: this.user.nome, email: this.user.email });

    // Atualizar localStorage
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));

    // Limpar formulário
    this.user = { nome: '', email: '', password: '', confirmPassword: '' };
  }

  removeUser(index: number) {
    // Remover usuário da lista
    this.usuarios.splice(index, 1);

    // Atualizar localStorage
    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }
}
