import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '@features/products/models/product.model';
import { CartItem } from '../model/cart-item.model';

describe('CartService', () => {
  let service: CartService;

  const mockProduct1: Product = {
    id: 1,
    name: 'Test Product 1',
    price: 10.99,
    description: 'Test description',
    imageUrl: 'test.jpg',
    category: 'test'
  };

  const mockProduct2: Product = {
    id: 2,
    name: 'Test Product 2',
    price: 20.50,
    description: 'Test description 2',
    imageUrl: 'test2.jpg',
    category: 'test'
  };

  beforeEach(() => {
    // Wyczyść localStorage przed każdym testem
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [CartService]
    });
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initial state', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty cart initially', () => {
      expect(service.items()).toEqual([]);
      expect(service.isEmpty()).toBe(true);
      expect(service.totalItems()).toBe(0);
      expect(service.totalPrice()).toBe(0);
    });
  });

  describe('Adding items', () => {
    it('should add new item to cart', () => {
      service.addToCart(mockProduct1);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].product).toEqual(mockProduct1);
      expect(service.items()[0].quantity).toBe(1);
      expect(service.isEmpty()).toBe(false);
    });

    it('should increase quantity when adding existing item', () => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct1);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(2);
    });

    it('should add multiple different items', () => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct2);

      expect(service.items().length).toBe(2);
      expect(service.items()[0].product.id).toBe(1);
      expect(service.items()[1].product.id).toBe(2);
    });
  });

  describe('Removing items', () => {
    beforeEach(() => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct2);
    });

    it('should remove item from cart', () => {
      service.removeFromCart(1);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].product.id).toBe(2);
    });

    it('should not affect cart when removing non-existent item', () => {
      const initialLength = service.items().length;
      service.removeFromCart(999);

      expect(service.items().length).toBe(initialLength);
    });
  });

  describe('Decreasing item quantity', () => {
    beforeEach(() => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct1); // quantity = 2
    });

    it('should decrease item quantity', () => {
      service.decreaseItem(1);

      expect(service.items()[0].quantity).toBe(1);
      expect(service.items().length).toBe(1);
    });

    it('should not affect cart when decreasing non-existent item', () => {
      const initialItems = service.items();
      service.decreaseItem(999);

      expect(service.items()).toEqual(initialItems);
    });
  });

  describe('Clearing cart', () => {
    beforeEach(() => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct2);
    });

    it('should clear all items from cart', () => {
      service.clearCart();

      expect(service.items()).toEqual([]);
      expect(service.isEmpty()).toBe(true);
      expect(service.totalItems()).toBe(0);
      expect(service.totalPrice()).toBe(0);
    });
  });

  describe('Computed values', () => {
    beforeEach(() => {
      service.addToCart(mockProduct1); // price: 10.99, quantity: 1
      service.addToCart(mockProduct1); // quantity: 2
      service.addToCart(mockProduct2); // price: 20.50, quantity: 1
    });

    it('should calculate total items correctly', () => {
      expect(service.totalItems()).toBe(3); // 2 + 1
    });

    it('should calculate total price correctly', () => {
      const expectedTotal = (10.99 * 2) + (20.50 * 1);
      expect(service.totalPrice()).toBeCloseTo(expectedTotal, 2);
    });

    it('should return false for isEmpty when items exist', () => {
      expect(service.isEmpty()).toBe(false);
    });
  });

  describe('Get item', () => {
    beforeEach(() => {
      service.addToCart(mockProduct1);
      service.addToCart(mockProduct1); // quantity: 2
    });

    it('should return computed signal for existing item', () => {
      const itemSignal = service.getItem(1);
      const item = itemSignal();

      expect(item).toBeDefined();
      expect(item?.product.id).toBe(1);
      expect(item?.quantity).toBe(2);
    });

    it('should return undefined for non-existent item', () => {
      const itemSignal = service.getItem(999);
      const item = itemSignal();

      expect(item).toBeUndefined();
    });
  });

  describe('Local storage persistence', () => {
    it('should persist cart to localStorage when adding items', () => {
      service.addToCart(mockProduct1);

      const storedCart = JSON.parse(localStorage.getItem('cartId') || '[]');
      expect(storedCart).toEqual([{
        product: mockProduct1,
        quantity: 1
      }]);
    });

    it('should restore cart from localStorage on initialization', () => {
      const cartItems: CartItem[] = [{
        product: mockProduct1,
        quantity: 2
      }];
      localStorage.setItem('cartId', JSON.stringify(cartItems));

      // Utwórz nową instancję serwisu
      const newService = TestBed.inject(CartService);

      expect(newService.items()).toEqual(cartItems);
      expect(newService.totalItems()).toBe(2);
    });
  });
});
