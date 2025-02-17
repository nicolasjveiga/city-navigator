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
  paginatedPlaces: any[] = [];
  errorMessage: string = '';
  
  itemsPerPage: number = 8;
  currentPage: number = 0; 

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTopCitiesAttractions();
      
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
          this.getTouristAttractions(this.city);
        }
      });
    }
  }
  searchCity() {
    const input = document.getElementById('cityInput') as HTMLInputElement;
    if (input && input.value.trim() !== '') {
      this.city = input.value.trim();
      console.log('Buscando atrações para:', this.city);
      this.getTouristAttractions(this.city);
    } else {
      console.warn('Nenhuma cidade inserida.');
    }
  }
  
  viewPlaceDetails(place: any) {
    console.log("Place selecionado:", place);
    if (!place.place_id) {
      console.error("O place_id está indefinido para esse local:", place);
      return;
    }
    // Adiciona a propriedade 'photo' à query string
    window.location.href = `/place-details/${encodeURIComponent(place.place_id)}?name=${encodeURIComponent(place.name)}&photo=${encodeURIComponent(place.photo)}`;
  }
  

  loadTopCitiesAttractions(){
    fetch(`http://localhost:3000/top-cities-attractions`)
      .then(response => response.json())
      .then(data => {
        this.places = data.places;
        console.log("Dados carregado:", this.places);
        this.currentPage = 0;
        this.updatePaginatedPlaces();
      })
      .catch(error => {
        console.error('Erro ao carregar as atrações principais:', error);
        this.errorMessage = 'Erro ao carregar os melhores pontos turísticos.';
      });
  }

  getTouristAttractions(city: string) {
    const formatterCity = encodeURIComponent(city.trim());
    fetch(`http://localhost:3000/tourist-attractions/${formatterCity}`)
      .then(response => response.json())
      .then(data => {
        if (data.places) {
          this.places = data.places;
          this.currentPage = 0;
          this.updatePaginatedPlaces();
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
  getStars(rating: number): string[] {
    console.log(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('full');
      } else if (i - 0.5 <= rating) {
        stars.push('half'); 
      } else {
        stars.push('empty'); 
      }
    }
    return stars;
  }
  


  removePlace(index:number) {
    this.paginatedPlaces = [...this.paginatedPlaces.slice(0, index), ...this.paginatedPlaces.slice(index + 1)];
  }
  updatePaginatedPlaces() {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedPlaces = this.places.slice(start, end);
  }

  nextPage() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.places.length) {
      this.currentPage++;
      this.updatePaginatedPlaces();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePaginatedPlaces();
    }
  }
}

