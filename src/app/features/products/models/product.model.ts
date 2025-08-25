import * as z from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
  imageUrl: z.string()
});


export const ProductsSchema = z.array(ProductSchema);


export type Product = z.infer<typeof ProductSchema>;
