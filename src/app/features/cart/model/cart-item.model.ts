import { Product } from '@features/products/models/product.model';

export type CartItem = {
  product: Product,
  quantity: number
};
