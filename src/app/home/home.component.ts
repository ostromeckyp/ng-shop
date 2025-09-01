import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '@auth/services/auth.service';
import { CartService } from '@features/cart';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    MatButtonModule, MatToolbarModule, MatIconModule, MatBadgeModule,
    RouterLink, RouterLinkActive
  ],
  template: `
    <mat-toolbar color="primary">
      <span>{{ title }}</span>
      <span class="spacer"></span>

      @if (authService.isAuthenticated()) {
        <button mat-button routerLink="/products" routerLinkActive="link-active">
          <mat-icon>shopping_bag</mat-icon>
          Products
        </button>
        <button mat-button routerLink="/cart" routerLinkActive="link-active">
          <mat-icon
            [matBadge]="cartService.totalItems()"
            [matBadgeHidden]="cartService.isEmpty()"
            matBadgeColor="accent"
          >shopping_cart
          </mat-icon>
          Cart
        </button>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      } @else {
        <button mat-button routerLink="/login">
          <mat-icon>login</mat-icon>
          Login
        </button>
      }
    </mat-toolbar>
    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: 'home.component.scss'
})
export class HomeComponent {
  protected title = 'ng-shop';
  protected authService: AuthService = inject(AuthService);
  protected cartService: CartService = inject(CartService);

  logout(): void {
    this.authService.logout();
  }
}
