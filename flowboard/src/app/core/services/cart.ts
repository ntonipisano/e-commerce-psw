import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart } from '../models/cart';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly apiUrl = 'http://localhost:3000'; // backend Rails

  private readonly emptyCart: Cart = {
  id: 0,
  cart_items: []
  };

  private cartSubject = new BehaviorSubject<Cart>(this.emptyCart);
  cart$ = this.cartSubject.asObservable();


  private http = inject(HttpClient);

  loadCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/cart`).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }


  addItem(productId: number, quantity = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/cart/items`, {
      product_id: productId,
      quantity
    }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  updateItem(itemId: number, quantity: number): Observable<Cart> {
    return this.http.patch<Cart>(`${this.apiUrl}/cart/items/${itemId}`, {
      quantity
    }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  removeItem(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/cart/items/${itemId}`)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  getTotal(): number {
    const cart = this.cartSubject.value;
    if (!cart) return 0;

    return cart.cart_items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
  }

  clearLocal(): void {
    this.cartSubject.next(this.emptyCart);
  }
}
