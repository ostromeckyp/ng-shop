import { computed, Injectable, signal } from '@angular/core';
import { Product } from '@features/products/models/product.model';
import { CartItem } from '../model/cart-item.model';
import { catchError, map, merge, of, share, Subject, tap } from 'rxjs';
import { connect } from 'ngxtension/connect';
import { injectLocalStorage } from 'ngxtension/inject-local-storage';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

type CartState = {
  items: CartItem[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cart = injectLocalStorage<CartItem[]>('cartId', {storageSync: true});

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
  private readonly removeFromCart$ = new Subject<string>();
  private readonly decreaseItem$ = new Subject<string>();
  private readonly clearCart$ = new Subject<void>();

  //side effects
  // private readonly syncCart$ = new Subject<void>();

  constructor() {
    //Approach 1
    const addItemSuccess$ = new Subject<CartItem[]>();
    const addItemError$ = new Subject<string>();
    this.addItem$.pipe(
      map((product: Product) => {
        const existingItemIndex = this.items().findIndex(i => i.product.id === product.id);
        return existingItemIndex >= 0
          ? this.items().map(item =>
            item.product.id === product.id
              ? {...item, quantity: item.quantity + 1}
              : item)
          : [...this.items(), {product, quantity: 1}];
      }),
      tap((items: CartItem[]) => {
        // this.cart.set(items);
        addItemSuccess$.next(items);
      }),
      catchError(err => {
        addItemError$.next(err);
        return of(this.items());
      }),
      takeUntilDestroyed()
    ).subscribe();

    const cartCleared$ = this.clearCart$.pipe(
      map(() => {
        return [] as CartItem[];
      }), share());


    const itemRemoved$ = this.removeFromCart$.pipe(
      map((productId) =>
        this.items().filter(item => item.product.id !== productId)
      ), share());

    const itemDecreased$ = this.decreaseItem$.pipe(
      map((productId) => {
        const existingItemIndex = this.items().findIndex(i => i.product.id === productId);
        if (existingItemIndex >= 0) {
          return this.items().map(item =>
            item.product.id === productId
              ? {...item, quantity: item.quantity -= 1} : item);
        }
        return this.items();
      }),
      share()
    );

    merge(cartCleared$, addItemSuccess$, itemRemoved$, itemDecreased$).pipe(
      tap((value) => this.cart.set(value)),
      takeUntilDestroyed()
    ).subscribe()


    // Approach 2
    // const itemAdded$ = this.addItem$.pipe(
    //   map((product) => {
    //     const existingItemIndex = this.items().findIndex(i => i.product.id === product.id);
    //     return existingItemIndex >= 0 ? this.items().map(item =>
    //       item.product.id === product.id
    //         ? {...item, quantity: item.quantity + 1}
    //         : item) : [...this.items(), {product, quantity: 1}];
    //   }),
    //   tap((items) =>
    //     this.cart.set(items)
    //   ),
    // );
    const storedCart$ = toObservable(this.cart);

    connect(this.state)
      .with(storedCart$, (state, items) => ({
        ...state,
        items: items || []
      }))
      // .with(
      //   itemAdded$, (state, items) => {
      //     return {
      //       ...state,
      //       items
      //     };
      //   })
      .with(
        addItemSuccess$, (state, items) => {
          return {
            ...state,
            items
          };
        })
      .with(
        cartCleared$, (state, productId) => ({
          ...state,
          items: []
        }))
      .with(itemRemoved$, (state, items) => {
        return {
          ...state,
          items
        }
      })
      .with(itemDecreased$, (state, items) => {
        return {
          ...state,
          items
        };
      })
    // TODO - when you uncomment - add share to itemAdded$
    // .with(itemAdded$, (state, productId) => {
    //   return {
    //     ...state,
    //     synced: true
    //   };
    // });
  }

  // API
  addToCart(item: Product) {
    this.addItem$.next(item);
  }

  removeFromCart(productId: string): void {
    this.removeFromCart$.next(productId);
  }

  decreaseItem(productId: string): void {
    this.decreaseItem$.next(productId);
  }

  clearCart(): void {
    this.clearCart$.next();
  }

  getItem(productId: string) {
    return computed(() => this.items().find(item => item.product.id === productId));
  }
}
