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

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  constructor(public auth: AuthService) {}
  toggleLogin(): void {
  this.auth.isLoggedIn ? this.auth.logout() : this.auth.login();
  }
}
