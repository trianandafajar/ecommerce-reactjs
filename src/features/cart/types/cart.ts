import type { Product } from "@/features/product/types/product";

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  user_id?: string | null;
  created_at: string;
  items: CartItem[];
}
