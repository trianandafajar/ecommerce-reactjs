import { Decimal } from "decimal.js";

// ---------------- ORDER ITEM ----------------
export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: Decimal;
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
  payment_method: "cod" | "bank_transfer";
  first_name?: string;
  last_name?: string;
  address: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  total_amount: Decimal;
  created_at: string;
  items: OrderItem[];
}

// create order payload
export interface OrderCreate {
  user_id?: string;
  status?: "pending" | "paid" | "shipped" | "completed" | "cancelled"; 
  payment_method: "cod" | "bank_transfer";
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
