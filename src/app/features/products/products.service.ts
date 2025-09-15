import { computed, effect, inject, Injectable, Injector, signal, untracked } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Product, ProductsSchema } from '@features/products/models/product.model';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { injectSetQuery } from '@shared/utils/set-query-params';
import { derivedFrom } from 'ngxtension/derived-from';
import { debounceTime, map, pipe } from 'rxjs';
import { CartService } from '@features/cart';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly injector = inject(Injector);
  private readonly cartService = inject(CartService);

  // Query
  private readonly queryParam = injectQueryParams('search');
  private readonly setQuery = injectSetQuery();

  readonly searchFilter = signal(this.queryParam() ?? '');
  private readonly filter = derivedFrom([this.searchFilter], pipe(
    map(([value]) => value.toLowerCase().trim()),
    debounceTime(300)
  ), {initialValue: this.searchFilter()});
  private readonly url = computed(() => {
    const filter = this.filter();
    const query = filter ? `?q=${filter}` : '';
    return `/api/products${query}`
  });

  // Resource
  private readonly productsResource = httpResource<Product[]>(
    () => this.url(),
    {
      parse: (data) => ProductsSchema.parse(data),
      defaultValue: [],
      injector: this.injector
    }
  );
  readonly products = this.productsResource.value.asReadonly();
  readonly isLoading = this.productsResource.isLoading;
  readonly error = this.productsResource.error;


  // readonly filteredProducts = computed(() => {
  //   const filter = this.filter();
  //   const allProducts = this.products();
  //
  //   if (!filter) {
  //     return allProducts;
  //   }
  //
  //   return allProducts.filter(product =>
  //     product.name.toLowerCase().includes(filter) ||
  //     product.description.toLowerCase().includes(filter)
  //   );
  // });


  private readonly queryParamEffect = effect(() => {
    const queryParamValue = this.filter();
    untracked(() => {
      this.setQuery.setQueryParam('search', queryParamValue);
    });
  });

  private readonly errorEffect = effect(() => {
    if (this.error()) {
      console.error('Error loading products:', this.error());
    }
  });

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
