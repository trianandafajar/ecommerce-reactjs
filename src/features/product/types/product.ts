// src/features/product/types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: Date | string
  updated_at?: Date | string;
}