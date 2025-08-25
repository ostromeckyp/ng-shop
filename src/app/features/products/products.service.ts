import { inject, Injectable, Injector } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Product, ProductsSchema } from '@features/products/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly url = 'assets/data/products.json';
  private readonly injector = inject(Injector);

  private readonly productsResource = httpResource<Product[]>(
    () => this.url,
    {parse: (data) => ProductsSchema.parse(data), defaultValue: [], injector: this.injector}
  );

  readonly products = this.productsResource.value.asReadonly();
}
