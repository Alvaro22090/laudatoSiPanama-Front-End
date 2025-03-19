import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  loginUrl: string = 'http://localhost:8080/login';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  async submitLogin(usuario: LoginData): Promise<void> {
    const response = await fetch(this.loginUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(usuario)
    });
    if (!response.ok) {
      throw new Error('Error al enviar la solicitud');
    }
    const result = await response.json();
    const user: User = {
      role: result.role,
      user: result.user,
      jwTtoken: result.jwTtoken
    };
    console.log('Aplicación enviada con éxito: ', JSON.stringify(user));
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
  constructor() { 
    this.loadUserFromStorage();
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.role === role;
  }

  getToken(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.jwTtoken : null;
  }
}

export interface LoginData {
  usuarioId: string;
  usuarioContrasena: string;
}

export interface User {
  role: string;
  user: string;
  jwTtoken: string;
}