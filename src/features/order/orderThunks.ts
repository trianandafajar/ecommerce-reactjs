// src/features/order/orderThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Order, OrderCreate, OrderUpdateStatus } from "./types/order";
import type { StandardResponse } from "@/types/api";
import { GET, POST, PUT, DELETE } from "@/lib/api";

const CUSTOMER_API_URL = "/orders";
const ADMIN_API_URL = "/admin/orders";

export interface AdminOrderFilters {
  skip?: number;
  limit?: number;
  status_value?: Order["status"] | "all";
  customer_id?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

// Create order
export const createOrder = createAsyncThunk<
  Order,
  OrderCreate,
  { rejectValue: string }
>("order/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<Order>>(`${CUSTOMER_API_URL}/`, payload);
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
    const res = await GET<StandardResponse<Order[]>>(`${CUSTOMER_API_URL}/`);
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch orders");
  }
});

// Fetch all admin orders with filters
export const fetchAdminOrders = createAsyncThunk<
  Order[],
  AdminOrderFilters | void,
  { rejectValue: string }
>("order/fetchAdminAll", async (filters, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<Order[]>>(ADMIN_API_URL, {
      params: {
        skip: filters?.skip ?? 0,
        limit: filters?.limit ?? 100,
        status_value: filters?.status_value && filters.status_value !== "all"
          ? filters.status_value
          : undefined,
        customer_id: filters?.customer_id || undefined,
        start_date: filters?.start_date || undefined,
        end_date: filters?.end_date || undefined,
        search: filters?.search || undefined,
      },
    });
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
    const res = await GET<StandardResponse<Order>>(`${CUSTOMER_API_URL}/${orderId}`);
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch order detail");
  }
});

// Fetch single admin order
export const fetchAdminOrder = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("order/fetchAdminOne", async (orderId, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<Order>>(`/admin/orders/${orderId}`);
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
      `${CUSTOMER_API_URL}/${orderId}/status`,
      { status }
    );
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to update order status");
  }
});

// Update admin order status
export const updateAdminOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: OrderUpdateStatus["status"] },
  { rejectValue: string }
>("order/updateAdminStatus", async ({ orderId, status }, { rejectWithValue }) => {
  try {
    const res = await PUT<StandardResponse<Order>>(`/admin/orders/${orderId}/status`, {
      status,
    });
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
      `${CUSTOMER_API_URL}/${orderId}`
    );
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data.deleted_id;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to delete order");
  }
});
