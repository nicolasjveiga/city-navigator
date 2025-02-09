import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  city: string = '';
  places: any[] = [];
  errorMessage: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const input = document.getElementById('cityInput') as HTMLInputElement;

      if (!input) {
        this.errorMessage = 'Campo de entrada não encontrado!';
        console.error(this.errorMessage);
        return;
      }

      if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
        this.errorMessage = 'Google Maps API não carregada corretamente.';
        console.error(this.errorMessage);
        return;
      }

      const autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['(cities)'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          this.city = place.formatted_address;
          console.log('Cidade selecionada:', this.city);
          this.getTouristAttractions(this.city); // 🔹 Busca os locais turísticos
        }
      });
    }
  }

  getStars(rating:number): number[]{
    const stars = Math.round(rating);
    return Array(stars).fill(0);

  }

  getTouristAttractions(city: string) {
    fetch(`http://localhost:3000/tourist-attractions/${city}`)
      .then(response => response.json())
      .then(data => {
        if (data.places) {
          this.places = data.places;
          console.log("Lugares turísticos encontrados:", this.places);
        } else {
          this.errorMessage = 'Nenhum local encontrado.';
        }
      })
      .catch(error => {
        console.error('Erro ao buscar locais turísticos:', error);
        this.errorMessage = 'Erro ao carregar os lugares turísticos.';
      });
  }
}
