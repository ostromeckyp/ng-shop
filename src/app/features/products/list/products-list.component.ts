import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../products.service';
import { NgOptimizedImage } from '@angular/common';
import { derivedFrom } from 'ngxtension/derived-from';
import { debounceTime, map, pipe } from 'rxjs';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { injectSetQuery } from '@shared/utils/set-query-params';
import { CartService } from '@features/cart';
import { Product } from '@features/products/models/product.model';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    NgOptimizedImage
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly queryParam = injectQueryParams('search');
  private readonly setQuery = injectSetQuery();

  protected readonly searchFilter = signal(this.queryParam() ?? '');
  // TODO - it's example for live coding
  protected readonly filter = derivedFrom([this.searchFilter], pipe(
    map(([value]) => value.toLowerCase().trim()),
    debounceTime(300)
  ), {initialValue: this.searchFilter()});

  private readonly queryParamEffect = effect(() => {
    const queryParamValue = this.filter();
    untracked(() => {
      this.setQuery.setQueryParam('search', queryParamValue);
    });
  });

  protected readonly filteredProducts = computed(() => {
    const filter = this.filter();
    const allProducts = this.productsService.products();

    if (!filter) {
      return allProducts;
    }

    return allProducts.filter(product =>
      product.name.toLowerCase().includes(filter) ||
      product.description.toLowerCase().includes(filter)
    );
  });

  protected addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
