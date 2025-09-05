// src/features/product/productThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "./types/product";
import type { StandardResponse } from "@/types/api";
import { GET, POST } from "@/lib/api";

export interface PaginationResource {
  page: number;
  per_page: number;
}

export const fetchProducts = createAsyncThunk<
  Product[],
  PaginationResource,
  { rejectValue: string }
>("product/getAll", async (payload, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<Product[]>>("/products", {
      params: { skip: payload.page, limit: payload.per_page },
    });

    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }

    return res.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to fetch products");
  }
});

export const createProduct = createAsyncThunk<
  Product,
  Omit<Product, "id" | "created_at" | "updated_at">,
  { rejectValue: string }
>("product/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<Product>>("products", payload);
    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }

    return res.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to fetch products");
  }
});

export const getDetailProduct = createAsyncThunk<
  Product,
  string, // productId
  { rejectValue: string }
>("product/getDetail", async (productId, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<Product>>(`/products/${productId}`);

    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }

    return res.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to fetch product detail");
  }
});
