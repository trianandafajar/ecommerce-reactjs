// src/features/product/productSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "./types/product";
import {
  fetchProducts,
  createProduct,
  getDetailProduct,
} from "./productThunks";
import type { PaginationMeta } from "@/types/api";

interface ProductState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    per_page: 12,
    total: 0,
    has_next: false,
    has_prev: false,
    pages: 0
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled,(state, action: PayloadAction<{ items: Product[]; pagination: PaginationMeta }>) => {
          state.loading = false;
          const { items, pagination } = action.payload;
          if (pagination.page === 1) {
            state.items = items;
          } else {
            state.items = [...state.items, ...items];
          }

          state.pagination = pagination;
          
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      });

    // createProduct
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.items.push(action.payload);
        }
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create product";
      });

    // getDetailProduct
    builder
      .addCase(getDetailProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(
        getDetailProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.selectedProduct = action.payload;
        }
      )
      .addCase(getDetailProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product detail";
        state.selectedProduct = null;
      });
  },
});

export const { clearSelectedProduct, clearError } = productSlice.actions;

export default productSlice.reducer;
