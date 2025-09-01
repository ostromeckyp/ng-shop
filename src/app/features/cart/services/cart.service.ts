import { computed, Injectable, signal } from '@angular/core';
import { Product } from '@features/products/models/product.model';
import { CartItem } from '../model/cart-item.model';
import { Subject } from 'rxjs';
import { connect } from 'ngxtension/connect';

type CartState = {
  items: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly state = signal<CartState>({
    items: []
  });

  // selectors (derived state)
  readonly items = computed(() => this.state().items);

  readonly totalItems = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this.items().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );
  readonly isEmpty = computed(() => this.items().length === 0);

  // sources
  private readonly addItem$ = new Subject<Product>();
  private readonly removeFromCart$ = new Subject<number>();
  private readonly decreaseItem$ = new Subject<number>();
  private readonly clearCart$ = new Subject<void>();

  constructor() {
    connect(this.state)
      .with(
        this.addItem$, (state, product) => {
          const existingItemIndex = state.items.findIndex(i => i.product.id === product.id);
          if (existingItemIndex >= 0) {
            return {
              ...state,
              items: state.items.map(item =>
                item.product.id === product.id
                  ? {...item, quantity: item.quantity + 1}
                  : item
              )
            };
          } else {
            return {
              ...state,
              items: [...state.items, {product, quantity: 1}]
            };
          }
        })
      .with(
        this.clearCart$, (state, productId) => ({
          ...state,
          items: []
        }))
      .with(this.removeFromCart$, (state, productId) => {
        return {
          ...state,
          items: state.items.filter(item => item.product.id !== productId)
        }
      })
      .with(this.decreaseItem$, (state, productId) => {
        const existingItemIndex = state.items.findIndex(i => i.product.id === productId);
        if (existingItemIndex >= 0) {
          return {
            ...state,
            items: state.items.map(item =>
              item.product.id === productId
                ? {...item, quantity: item.quantity -= 1} : item),
          };
        }
        return state;
      });
  }

  // API
  addToCart(item: Product) {
    this.addItem$.next(item);
  }

  removeFromCart(productId: number): void {
    this.removeFromCart$.next(productId);
  }

  decreaseItem(productId: number): void {
    this.decreaseItem$.next(productId);
  }

  clearCart(): void {
    this.clearCart$.next();
  }

  getItem(productId: number) {
    return computed(() => this.items().find(item => item.product.id === productId));
  }
}
