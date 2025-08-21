import { Injectable, signal } from '@angular/core';
import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // Using signals for products data
  private productsSignal = signal<Product[]>([
    {
      id: 1,
      name: 'Product 1',
      price: 19.99,
      description: 'Lekki i uniwersalny produkt do codziennego użytku.',
      imageUrl: 'https://picsum.photos/seed/p1/300/300'
    },
    {
      id: 2,
      name: 'Product 2',
      price: 24.49,
      description: 'Wytrzymała konstrukcja i prosty design.',
      imageUrl: 'https://picsum.photos/seed/p2/300/300'
    },
    {
      id: 3,
      name: 'Product 3',
      price: 14.99,
      description: 'Kompaktowy format, idealny w podróży.',
      imageUrl: 'https://picsum.photos/seed/p3/300/300'
    },
    {
      id: 4,
      name: 'Product 4',
      price: 39.9,
      description: 'Wysoka jakość wykonania i nowoczesny styl.',
      imageUrl: 'https://picsum.photos/seed/p4/300/300'
    },
    {
      id: 5,
      name: 'Product 5',
      price: 9.99,
      description: 'Dobry stosunek ceny do jakości.',
      imageUrl: 'https://picsum.photos/seed/p5/300/300'
    },
    {
      id: 6,
      name: 'Product 6',
      price: 29.0,
      description: 'Sprawdza się w domu i w pracy.',
      imageUrl: 'https://picsum.photos/seed/p6/300/300'
    },
    {
      id: 7,
      name: 'Product 7',
      price: 54.99,
      description: 'Rozszerzone możliwości i solidne materiały.',
      imageUrl: 'https://picsum.photos/seed/p7/300/300'
    },
    {
      id: 8,
      name: 'Product 8',
      price: 17.5,
      description: 'Minimalistyczny wygląd i łatwość obsługi.',
      imageUrl: 'https://picsum.photos/seed/p8/300/300'
    },
    {
      id: 9,
      name: 'Product 9',
      price: 22.0,
      description: 'Idealny na prezent, neutralny charakter.',
      imageUrl: 'https://picsum.photos/seed/p9/300/300'
    },
    {
      id: 10,
      name: 'Product 10',
      price: 44.99,
      description: 'Dopracowane detale i wysoka ergonomia.',
      imageUrl: 'https://picsum.photos/seed/p10/300/300'
    }
  ]);

  // Expose a readonly version of the products data
  readonly products = this.productsSignal.asReadonly();

  constructor() {
  }

  // In a real app, this would fetch products from an API
  fetchProducts(): void {
    // This is a dummy implementation
    // In a real app, you would fetch products from an API
    console.log('Fetching products...');
  }
}
