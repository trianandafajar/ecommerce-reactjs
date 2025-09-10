import { type Product } from './../product/types/product';
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Cart } from "./types/cart";
import { GET, POST } from "@/lib/api";
import { type StandardResponse } from "@/types/api";

// -------------------- FETCH CART --------------------
export const fetchSessionCart = createAsyncThunk<
  Cart,
  string,
  { rejectValue: string }
>("cart/fetchSession", async (cart_id, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<Cart>>(`/carts/${cart_id}`);

    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }
    return res.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to fetch cart");
  }
});

// -------------------- CREATE CART --------------------
export const createCart = createAsyncThunk<
  Cart,
  { user_id?: string; session_token: string },
  { rejectValue: string }
>("cart/createCart", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<
      StandardResponse<Cart>,
      { user_id?: string; session_token: string }
    >("/carts", payload);

    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }
    return res.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to create cart");
  }
});

// -------------------- LOOKUP CART --------------------
export const lookupCart = createAsyncThunk<
  Cart,
  { user_id?: string; session_id?: string },
  { rejectValue: string }
>("cart/lookupCart", async (payload, { rejectWithValue }) => {
  try {
    const query = payload.user_id
      ? `user_id=${payload.user_id}`
      : `session_id=${payload.session_id}`;
    const res = await GET<StandardResponse<Cart>>(`/carts/lookup?${query}`);

    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }
    return res.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to lookup cart");
  }
});

// -------------------- ADD ITEM --------------------
export const addCartItem = createAsyncThunk<
  CartItem,
  { cart_id: string; product_id: string; quantity: number },
  { rejectValue: string }
>("cart/addItem", async ({ cart_id, product_id, quantity }, { rejectWithValue }) => {
  try {
    const res = await POST<
      StandardResponse<Product>
    >(`/carts/${cart_id}/items`, { product_id, quantity });

    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }
    return res.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to add item");
  }
});

// -------------------- UPDATE ITEM --------------------
export const updateCartItem = createAsyncThunk<
  CartItem,
  { cart_id: string; item_id: string; quantity: number },
  { rejectValue: string }
>("cart/updateItem", async ({ cart_id, item_id, quantity }, { rejectWithValue }) => {
  try {
    const res = await POST<
      StandardResponse<CartItem>,
      { quantity: number }
    >(`/carts/${cart_id}/items/${item_id}?_method=PUT`, { quantity });

    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }
    return res.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to update item");
  }
});

// -------------------- DELETE ITEM --------------------
export const deleteCartItem = createAsyncThunk<
  { id: string },
  { cart_id: string; item_id: string },
  { rejectValue: string }
>("cart/deleteItem", async ({ cart_id, item_id }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/v1/carts/${cart_id}/items/${item_id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed with status ${res.status}`);
    }

    const data: StandardResponse<{}> = await res.json();
    if (data.status !== "success") {
      return rejectWithValue(data.message);
    }

    return { id: item_id };
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to delete item");
  }
});
