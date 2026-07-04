// src/features/order/orderSlice.ts
import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Order } from "./types/order";
import {
  createOrder,
  fetchOrders,
  fetchAdminOrders,
  fetchOrder,
  fetchAdminOrder,
  updateOrderStatus,
  updateAdminOrderStatus,
  deleteOrder,
} from "./orderThunks";

interface OrderState {
  orders: Order[];
  selectedOrder?: Order;
  loading: boolean;
  error?: string;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: undefined,
  loading: false,
  error: undefined,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch all orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch admin orders
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch single order
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch admin single order
    builder
      .addCase(fetchAdminOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchAdminOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchAdminOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update order status
    builder.addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) state.orders[index] = action.payload;
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
    });

    builder.addCase(updateAdminOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
      const index = state.orders.findIndex((o) => o.id === action.payload.id);
      if (index !== -1) state.orders[index] = action.payload;
      if (state.selectedOrder?.id === action.payload.id) {
        state.selectedOrder = action.payload;
      }
    });

    // Delete order
    builder.addCase(deleteOrder.fulfilled, (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
      if (state.selectedOrder?.id === action.payload) {
        state.selectedOrder = undefined;
      }
    });
  },
});

export default orderSlice.reducer;

const selectOrderState = (state: RootState) => state.order;

export const selectOrders = createSelector([selectOrderState], (order) => order.orders);
export const selectOrderLoading = createSelector([selectOrderState], (order) => order.loading);
export const selectOrderError = createSelector([selectOrderState], (order) => order.error);
export const selectSelectedOrder = createSelector([selectOrderState], (order) => order.selectedOrder);
