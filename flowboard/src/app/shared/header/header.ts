import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatToolbarModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private router = inject(Router);

  constructor(public auth: AuthService) {}

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  toggleLogin(): void {
    if (this.auth.isAuthenticated()) {
      this.auth.logout();
      // reindirizza alla home dopo logout
      this.router.navigate(['/products']);
    } else {
      // porta alla login page
      this.router.navigate(['/login']);
    }
  }
}