import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/header/header";
import { CartService } from './core/services/cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  currentYear = new Date().getFullYear();
  protected readonly title = signal('flowboard');
  constructor(private cartService: CartService) {
    this.cartService.loadCart().subscribe();
  }
}
