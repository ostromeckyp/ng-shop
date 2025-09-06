import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '@features/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatBadgeModule,
    NgOptimizedImage
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  protected readonly cartItems = this.cartService.items;
  protected readonly totalItems = this.cartService.totalItems;
  protected readonly totalPrice = this.cartService.totalPrice;
  protected readonly isEmpty = this.cartService.isEmpty;

  protected removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  protected clearCart(): void {
    this.cartService.clearCart();
  }

  protected increaseQuantity(productId: number): void {
    const item = this.cartService.getItem(productId)();
    if (item) {
      this.cartService.addToCart(item.product);
    }
  }

  protected decreaseQuantity(productId: number): void {
    this.cartService.decreaseItem(productId);
  }

  protected proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
