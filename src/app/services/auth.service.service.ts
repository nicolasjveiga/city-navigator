import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any>(null);

  isLoggedIn$ = this.loggedIn.asObservable();
  user$ = this.currentUser.asObservable();

  constructor() {
    
    if (this.isBrowser()) {
      const user = localStorage.getItem('user');
      if (user) {
        this.loggedIn.next(true);
        this.currentUser.next(JSON.parse(user));
      }
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (username && password) {
        const userData = { username };
        if (this.isBrowser()) {
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('Usuário salvo no localStorage:', userData);  
        }
        this.loggedIn.next(true);
        this.currentUser.next(userData);
        resolve(true);
      } else {
        reject(false);
      }
    });
  }
  
  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('user');
    }
    this.loggedIn.next(false);
    this.currentUser.next(null);
  }
  getUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user; 
  }
  
  
  
}
