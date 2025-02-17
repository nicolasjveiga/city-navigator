import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly apiUrl = 'https://api.pexels.com/v1/search';
  private readonly apiKey = 'B6h9drxZf6BGDu8FUMEJ23kRO9AqSimWKBRyHB1NPLWZQX5P9y6HSv9J';
  private readonly jsonServerUrl = 'http://localhost:3000/images';

  constructor(private http: HttpClient) { }

  fetchCityImages(city: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.apiKey);
    const url = `${this.apiUrl}?query=${city}&per_page=5`;
    
    return this.http.get(url, { headers });
  }

  saveImage(imageData: any): Observable<any> {
    return this.http.post(this.jsonServerUrl, imageData);
  }
}
