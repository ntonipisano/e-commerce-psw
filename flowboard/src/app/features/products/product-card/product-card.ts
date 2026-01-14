import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { WishlistService } from '../../../core/services/wishlist';
import { MatIconModule } from "@angular/material/icon";
import { Observable, firstValueFrom, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, DatePipe, MatButtonModule, MatCardModule, RouterModule, MatIconModule, AsyncPipe, MatSnackBarModule],
  standalone: true,
  templateUrl: `./product-card.html`,
  styleUrls: [`./product-card.scss`],
})

export class ProductCard {
    @Input({ required: true }) product!: Product;
    @Output () add = new EventEmitter<Product>();
    private CartService = inject(CartService);
    private WishlistService = inject(WishlistService);
    private snackBar = inject(MatSnackBar);

    // Observable booleano che indica se il prodotto è in wishlist
    inWishlist$!: Observable<boolean>;

    ngOnInit() {
      // Trasforma la wishlist in un booleano reactive
      this.inWishlist$ = this.WishlistService.wishlist$.pipe(
        map(items => items.some(item => item.product.id === this.product.id))
      );
    }

  onAddToCart(product: Product) {
    this.CartService.addItem(product.id, 1).subscribe({
      next: () => {
        this.snackBar.open(
          `"${product.title}" aggiunto al carrello`,
          'OK',
          {
            duration: 2500,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          }
        );
      },
      error: () => {
        this.snackBar.open(
          'Errore durante l’aggiunta al carrello',
          'Chiudi',
          { duration: 3000 }
        );
      }
    });
  }

  async toggleWishlist() {
     const isIn = await firstValueFrom(this.inWishlist$);
    if (isIn) {
      this.WishlistService.remove(this.product.id).subscribe();
    } else {
      this.WishlistService.add(this.product.id).subscribe();
    }
  }

isInWishlist(productId: number): boolean {
  return this.WishlistService.isInWishlist(productId);
}

} 