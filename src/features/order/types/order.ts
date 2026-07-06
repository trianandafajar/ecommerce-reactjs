import { Decimal } from "decimal.js";

// ---------------- ORDER ITEM ----------------
export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: Decimal;
  product?: {
    id: string;
    name: string;
    price: Decimal;
    image_url?: string | null;
  } | null;
}

// create order item
export interface OrderItemCreate {
  product_id: string;
  quantity: number;
  price: Decimal;
}

// ---------------- ORDER ----------------
export interface Order {
  id: string;
  user_id?: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  payment_method: "delivery" | "stripe";
  payment_provider?: string | null;
  stripe_checkout_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  stripe_customer_id?: string | null;
  first_name?: string;
  last_name?: string;
  address: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  total_amount: Decimal;
  created_at: string;
  updated_at?: string | null;
  items: OrderItem[];
}

// create order payload
export interface OrderCreate {
  user_id?: string;
  status?: "pending" | "paid" | "shipped" | "completed" | "cancelled"; 
  payment_method: "delivery" | "stripe";
  first_name?: string;
  last_name?: string;
  address: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  items: OrderItemCreate[];
}

// update status payload
export interface OrderUpdateStatus {
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
}
