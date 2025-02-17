import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiKey = 'AIzaSyAEK6lr2cl6ncyWsS6Spo3T_dd2M83xa5c';
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor(private http: HttpClient) {}

  getCityPlaceId(cityName: string): Observable<any> {
    const url = `${this.baseUrl}/findplacefromtext/json?input=${cityName}&inputtype=textquery&fields=place_id&key=${this.apiKey}`;
    return this.http.get(url);
  }

  getCityDetails(placeId: string): Observable<any> {
    const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=photo&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
