import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../products.service';
import { NgOptimizedImage } from '@angular/common';
import { Product } from '@features/products/models/product.model';
import { ProductCardSkeletonComponent } from '../skeleton';

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
    NgOptimizedImage,
    ProductCardSkeletonComponent
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent {
  private readonly productsService = inject(ProductsService);

  protected readonly searchFilter = this.productsService.searchFilter;
  protected readonly isLoading = this.productsService.isLoading;
  protected readonly filteredProducts = this.productsService.filteredProducts;

  protected addToCart(product: Product): void {
    this.productsService.addToCart(product);
  }
}
