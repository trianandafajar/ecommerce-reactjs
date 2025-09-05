import { v4 as uuidv4 } from "uuid";
import type { Product } from "../types/product";

export const createProduct = (data: Omit<Product, "id" | "created_at">): Product => {
  const timestamp = Date.now();
  return {
    ...data,
    id: `${uuidv4()}-${timestamp}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};