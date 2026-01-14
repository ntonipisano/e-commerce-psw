import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../core/models/product';
import { CartService } from '../../core/services/cart';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss'
})
export class WishlistPage {

  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);
  
  wishlist$ = this.wishlistService.wishlist$;

  remove(productId: number) {
    this.wishlistService.remove(productId).subscribe();
  }

   onAddToCart(product: Product) {
    this.cartService.addItem(product.id, 1).subscribe({
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
}

