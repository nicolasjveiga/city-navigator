import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importando comFetch
import { routes } from './app/app.routes';
import { HomeComponent } from './app/pages/home/home.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withFetch()) // Adicionando comFetch para habilitar o uso do fetch
  ]
}).catch(err => console.error(err));
