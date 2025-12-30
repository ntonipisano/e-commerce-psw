import { inject, Injectable } from '@angular/core';
import { ProductService } from './product';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  product$ = inject(ProductService);

  list() {
    return this.product$.list().pipe(
      map(products => products.slice(0,5))
    );
  }
}
