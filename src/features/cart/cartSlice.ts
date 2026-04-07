import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Cart, CartItem } from "@/features/cart/types/cart";
import {
  fetchSessionCart,
  createCart,
  lookupCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "./cartThunks";
import { logoutThunk } from "@/features/auth/authThunks";

interface CartState {
  cart: Cart | null;
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // 📦 FETCH CART
    builder
      .addCase(fetchSessionCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload.items;
      })
      .addCase(fetchSessionCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      });

    // 🆕 CREATE CART
    builder
      .addCase(createCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload.items;
      })
      .addCase(createCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create cart";
      });

    // 🔍 LOOKUP CART
    builder
      .addCase(lookupCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(lookupCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.items = action.payload.items;
      })
      .addCase(lookupCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to lookup cart";
      });

    // ➕ ADD ITEM
    builder.addCase(addCartItem.fulfilled, (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity = action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    });

    // ✏️ UPDATE ITEM
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      }
    });

    // ❌ DELETE ITEM
    builder.addCase(deleteCartItem.fulfilled, (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload.id);
    });

    builder
  .addCase(clearCart.fulfilled, (state, action) => {
    state.items = [];
    if (state.cart && state.cart.id === action.payload.cart_id) {
      state.cart.items = [];
    }
  })
  .addCase(clearCart.rejected, (state, action) => {
    state.error = action.payload || "Failed to clear cart";
  });

    // 🚪 LOGOUT (Clear cart on logout)
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.cart = null;
      state.items = [];
      state.error = null;
    });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;

// 🔍 Selectors
export const selectCart = (state: RootState) => state.cart.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartLoading = (state: RootState) => state.cart.loading;
export const selectCartError = (state: RootState) => state.cart.error;

export const selectCartItemCount = createSelector([selectCartItems], (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);

export const selectTotalItems = selectCartItemCount;

export const selectTotalPrice = createSelector([selectCartItems], (items) =>
  items.reduce(
    (total, item) => total + (item.product.price ?? 0) * item.quantity,
    0
  )
);
