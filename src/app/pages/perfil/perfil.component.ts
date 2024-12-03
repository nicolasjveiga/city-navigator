import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [],
  template: `
    <h1>Página do Perfil</h1>
    <p>Exibindo dados do usuário com ID: {{ userId }}</p>
  `
  ,
  styles: []
})
export class PerfilComponent {
  userId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
  }
}
