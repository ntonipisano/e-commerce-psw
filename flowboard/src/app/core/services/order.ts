import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CartService } from './cart';
import { Order } from '../models/order';
import { inject } from '@angular/core';
import { CreateOrder } from '../models/create-order';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:3000';
  private http = inject(HttpClient);
  private cartService = inject(CartService);
  
  createOrder(order: CreateOrder): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders`, order).pipe(
      tap(() => this.cartService.clearLocal()), // svuota il carrello locale
       catchError(err => {
        // Gestione globale degli errori
        let errorMessage = 'Errore imprevisto nella creazione dell’ordine';
        if (err.status === 422 && err.error.errors) {
          errorMessage = err.error.errors.join(', ');
        } else if (err.status === 401) {
          errorMessage = 'Non sei autenticato';
        } else if (err.status === 404) {
          errorMessage = 'Pagina non trovata';
        }
        // Puoi loggare o trasformare l'errore
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe(
      catchError(err => {
        let errorMessage = 'Errore nel caricamento degli ordini';
        if (err.status === 401) errorMessage = 'Non sei autenticato';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`).pipe(
      catchError(err => {
        let errorMessage = 'Errore nel caricamento dell’ordine';
        if (err.status === 404) errorMessage = 'Ordine non trovato';
        else if (err.status === 401) errorMessage = 'Non sei autenticato';
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}

