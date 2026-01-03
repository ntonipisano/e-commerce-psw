import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';

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
    addToCart (p: Product) {this.add.emit (p); 
  } 

}


