// src/features/product/productThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Product } from "./types/product";
import type { PaginationMeta, StandardResponse } from "@/types/api";
import { GET, POST } from "@/lib/api";

export interface PaginationResource {
  page: number;
  per_page: number;
  search?: string
}

const normalizeSearch = (search?: string) => search?.trim().toLowerCase() ?? "";

export const fetchProducts = createAsyncThunk<
  { items: Product[]; pagination: PaginationMeta; search: string },
  PaginationResource,
  { rejectValue: string; state: RootState }
>(
  "product/getAll",
  async (payload, { rejectWithValue }) => {
    try {
      const search = normalizeSearch(payload.search);
      const res = await GET<StandardResponse<Product[]>>("products/", {
        params: {
          page: payload.page,
          per_page: payload.per_page,
          ...(search ? { search } : {}),
        },
      });

      if (res.status !== "success") {
        return rejectWithValue(res.message);
      }

      return {
        items: res.data,
        pagination:
          res.metadata?.pagination ?? {
            page: payload.page,
            per_page: payload.per_page,
            total: res.data.length,
            pages: 1,
            has_next: false,
            has_prev: false,
          },
        search,
      };
    } catch (err: any) {
      console.error(err);
      return rejectWithValue(err.message || "Failed to fetch products");
    }
  },
  {
    condition: (payload, { getState }) => {
      const state = getState().product;
      const search = normalizeSearch(payload.search);
      const isFirstPage = payload.page === 1;

      if (state.listLoading) {
        return false;
      }

      if (
        isFirstPage &&
        state.activeQuery === search &&
        state.items.length > 0 &&
        state.pagination?.page === 1
      ) {
        return false;
      }

      if (
        !isFirstPage &&
        state.activeQuery === search &&
        state.pagination?.page !== undefined &&
        payload.page <= state.pagination.page
      ) {
        return false;
      }

      return true;
    },
  },
);

export const createProduct = createAsyncThunk<
  Product,
  Omit<Product, "id" | "created_at" | "updated_at">,
  { rejectValue: string }
>("product/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<Product>>("products/", payload);
    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }

    return res.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to create product");
  }
});

export const getDetailProduct = createAsyncThunk<
  Product,
  string, // productId
  { rejectValue: string }
>("product/getDetail", async (productId, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<Product>>(`products/${productId}`);

    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }

    return res.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to fetch product detail");
  }
});
