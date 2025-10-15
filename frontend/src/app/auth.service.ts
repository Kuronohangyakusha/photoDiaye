import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterData {
  email: string;
  motDePasse: string;
  nom?: string;
  telephone: string;
  role: 'VENDEUR' | 'ACHETEUR';
}

export interface LoginData {
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    nom?: string;
    telephone: string;
    role: string;
    estVip: boolean;
  };
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  // Méthodes utilitaires pour la gestion du token
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}