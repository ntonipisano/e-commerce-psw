import { Injectable, inject } from '@angular/core';
import { Order } from '../models/order';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  create(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`,order);
  }

}
