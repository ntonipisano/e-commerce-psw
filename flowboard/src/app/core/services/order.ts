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
        return throwError(() => err);
  })
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`).pipe(
      catchError(err => {
        return throwError(() => err);
  })
    );
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`).pipe(
      catchError(err => {
        return throwError(() => err);
  })
    );
  }
}

