import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, DatePipe, MatButtonModule, MatCardModule, RouterModule],
  standalone: true,
  templateUrl: `./product-card.html`,
  styleUrls: [`./product-card.scss`],
})

export class ProductCard {
    @Input({ required: true }) product!: Product;
    @Output () add = new EventEmitter<Product>();
    private CartService = inject(CartService);

    onAddToCart(product: Product) {
    this.CartService.addItem(product.id,1).subscribe();
    console.log('Aggiunto al carrello:', product);
  }
  } 