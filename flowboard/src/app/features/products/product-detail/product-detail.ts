import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap, map } from 'rxjs';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart';
@Component({
selector: 'app-product-detail'
,

standalone: true,
templateUrl: './product-detail.html'
,

imports: [RouterModule, AsyncPipe, MatCardModule, MatButtonModule, CurrencyPipe],
})
export class ProductDetail {
private CartService = inject(CartService);
private route = inject(ActivatedRoute);
private svc = inject(ProductService);
readonly product$ = this.route.paramMap.pipe(
map(params => params.get('id') as string),
switchMap(id => this.svc.getProductById(id)),
);

 onAddToCart(product: Product) {
    this.CartService.addItem(product.id,1).subscribe();
    console.log('Aggiunto al carrello:', product);
  }
}