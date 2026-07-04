// src/features/product/types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  category?: string | null;
  price: number;
  image_url?: string | null;
  created_at: Date | string;
  updated_at?: Date | string;
}
