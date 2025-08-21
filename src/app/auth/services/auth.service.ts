import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { injectLocalStorage } from 'ngxtension/inject-local-storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  /**
   * Dummy implementation of an authentication service.
   * In a real application, you would typically make HTTP requests to a backend service
   */
  readonly isAuthenticated = injectLocalStorage('authenticated', {storageSync: true})

  login(email: string, password: string): void {
    if (email && password) {
      this.isAuthenticated.set(true);
      this.router.navigate(['/products']);
    }
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
