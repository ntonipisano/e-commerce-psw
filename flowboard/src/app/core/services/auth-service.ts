import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface AuthResponse {
  token?: string;
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';
  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, 
      { email, password },
      { observe: 'response' }
    ).pipe(
      tap((response: HttpResponse<AuthResponse>) => {
        // Prova a leggere il token dal body della risposta
        let token = response.body?.token;
        
        // Se non c'è nel body, leggi dall'header Authorization
        if (!token) {
          const authHeader = response.headers.get('Authorization');
          if (authHeader) {
            // Header è "Bearer <token>"
            token = authHeader.replace('Bearer ', '');
          }
        }
        
        if (token) {
          this.setToken(token);
        }
      }),
      map(response => response.body as AuthResponse)
    );
  }

  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      user: {
        email,
        password,
      }
    });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
