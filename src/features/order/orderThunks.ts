// src/features/order/orderThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Order, OrderCreate, OrderUpdateStatus } from "./types/order";
import type { StandardResponse } from "@/types/api";
import { GET, POST, PUT, DELETE } from "@/lib/api";

const API_URL = "/orders";

// Create order
export const createOrder = createAsyncThunk<
  Order,
  OrderCreate,
  { rejectValue: string }
>("order/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<Order>>(`${API_URL}/`, payload);
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to create order");
  }
});

// Fetch all orders
export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<Order[]>>(`${API_URL}/`);
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch orders");
  }
});

// Fetch single order
export const fetchOrder = createAsyncThunk<
  Order,
  string, // orderId
  { rejectValue: string }
>("order/fetchOne", async (orderId, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<Order>>(`${API_URL}/${orderId}`);
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch order detail");
  }
});

// Update order status
export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: OrderUpdateStatus["status"] },
  { rejectValue: string }
>("order/updateStatus", async ({ orderId, status }, { rejectWithValue }) => {
  try {
    const res = await PUT<StandardResponse<Order>>(
      `${API_URL}/${orderId}/status`,
      { status }
    );
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update order status");
  }
});

// Delete order
export const deleteOrder = createAsyncThunk<
  string, // deleted order id
  string, // orderId
  { rejectValue: string }
>("order/delete", async (orderId, { rejectWithValue }) => {
  try {
    const res = await DELETE<StandardResponse<{ deleted_id: string }>>(
      `${API_URL}/${orderId}`
    );
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data.deleted_id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete order");
  }
});
