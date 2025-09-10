import type { Product } from "@/features/product/types/product";

export interface Cart {
    user_id: string;
    session_token: string;
    id: string;
    created_at: Date;
    items: Product[]
}