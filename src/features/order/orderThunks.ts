// src/features/order/orderThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Order, OrderCreate, OrderUpdateStatus } from "./types/order";
import type { PaginationMeta, StandardResponse } from "@/types/api";
import { GET, POST, PUT, DELETE } from "@/lib/api";

const CUSTOMER_API_URL = "/orders";
const ADMIN_API_URL = "/admin/orders";

export interface AdminOrderFilters {
  page?: number;
  per_page?: number;
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
  { items: Order[]; pagination: PaginationMeta },
  AdminOrderFilters | void,
  { rejectValue: string }
>("order/fetchAdminAll", async (filters, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<Order[]>>(ADMIN_API_URL, {
      params: {
        page: filters?.page ?? 1,
        per_page: filters?.per_page ?? 10,
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
    const meta = res.metadata?.pagination as
      | (PaginationMeta & { total_pages?: number })
      | undefined;
    return {
      items: res.data,
      pagination: {
        page: meta?.page ?? filters?.page ?? 1,
        per_page: meta?.per_page ?? filters?.per_page ?? 10,
        total: meta?.total ?? res.data.length,
        pages:
          meta?.pages ??
          meta?.total_pages ??
          (res.data.length > 0 ? Math.ceil(res.data.length / (filters?.per_page ?? 10)) : 0),
        has_next: meta?.has_next ?? false,
        has_prev: meta?.has_prev ?? false,
      },
    };
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
