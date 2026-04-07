import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Product } from "./types/product";
import { fetchProducts, createProduct, getDetailProduct } from "./productThunks";
import type { PaginationMeta } from "@/types/api";

interface ProductState {
  items: Product[];
  selectedProduct: Product | null;
  listLoading: boolean;
  detailLoading: boolean;
  createLoading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
  activeQuery: string;
}

const initialState: ProductState = {
  items: [],
  selectedProduct: null,
  listLoading: false,
  detailLoading: false,
  createLoading: false,
  error: null,
  pagination: {
    page: 1,
    per_page: 12,
    total: 0,
    has_next: false,
    has_prev: false,
    pages: 0,
  },
  activeQuery: "",
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
    setSelected(state, action: PayloadAction<Product>) {
      state.selectedProduct = action.payload;
      state.detailLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.listLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
          state.listLoading = false;
          const { items, pagination, search } = action.payload;
          if (pagination.page === 1) {
            state.items = items;
          } else {
            state.items = [...state.items, ...items];
          }
          state.pagination = pagination;
          state.activeQuery = search;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.listLoading = false;
        state.error = action.payload || "Failed to fetch products";
      });

    // createProduct
    builder
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.createLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || "Failed to create product";
      });

    // getDetailProduct
    builder
      .addCase(getDetailProduct.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(getDetailProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.detailLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getDetailProduct.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload || "Failed to fetch product detail";
        state.selectedProduct = null;
      });
  },
});

export const { clearSelectedProduct, clearError, setSelected } = productSlice.actions;
export default productSlice.reducer;

const selectProductState = (state: RootState) => state.product;

export const selectHomeProducts = createSelector(
  [selectProductState],
  (product) => product.items,
);

export const selectHomePagination = createSelector(
  [selectProductState],
  (product) => product.pagination,
);

export const selectHomeListLoading = createSelector(
  [selectProductState],
  (product) => product.listLoading,
);

export const selectHomeProductError = createSelector(
  [selectProductState],
  (product) => product.error,
);

export const selectSelectedProduct = createSelector(
  [selectProductState],
  (product) => product.selectedProduct,
);

export const selectProductDetailLoading = createSelector(
  [selectProductState],
  (product) => product.detailLoading,
);
