import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AloMundoComponent } from './alo-mundo/alo-mundo.component';
import { Componente2Component } from './componente-2/componente-2.component';  

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AloMundoComponent, Componente2Component],  
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'first-app';
}
