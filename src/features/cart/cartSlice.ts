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
        // Merge duplicates if backend returns them
        const mergedItems: CartItem[] = [];
        action.payload.items.forEach(item => {
          const existing = mergedItems.find(i => i.product_id === item.product_id);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            mergedItems.push({ ...item });
          }
        });
        state.items = mergedItems;
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
        
        // Merge duplicates if backend returns them
        const mergedItems: CartItem[] = [];
        action.payload.items.forEach(item => {
          const existing = mergedItems.find(i => i.product_id === item.product_id);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            mergedItems.push({ ...item });
          }
        });
        state.items = mergedItems;
      })
      .addCase(lookupCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to lookup cart";
      });

    // ➕ ADD ITEM
    builder.addCase(addCartItem.fulfilled, (state, action) => {
      const existing = state.items.find((i) => i.product_id === action.payload.product_id);
      if (existing) {
        // If backend returns the total quantity for this item record, use it.
        // If it returns just the added quantity, add it. 
        // Based on typical backend behavior for "add item", it usually returns 
        // the single record that was updated or created.
        existing.quantity = action.payload.quantity;
        existing.id = action.payload.id; // Sync ID in case it changed
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
