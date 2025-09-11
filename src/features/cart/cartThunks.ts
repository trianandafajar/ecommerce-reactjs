import { createAsyncThunk } from "@reduxjs/toolkit";
import { DELETE, GET, POST, PUT } from "@/lib/api";
import type { Cart, CartItem } from "./types/cart";
import type { StandardResponse } from "@/types/api";

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
  undefined,
  { rejectValue: string }
>("cart/createCart", async (_, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<Cart>>(
      "/carts/",
    );

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
  { session_id?: string },
  { rejectValue: string }
>("cart/lookupCart", async (payload, { rejectWithValue }) => {
  try {
    const query = payload.session_id ? `session_id=${payload.session_id}` : "";
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
      StandardResponse<CartItem>
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
    const res = await PUT<
      StandardResponse<CartItem>
    >(`/carts/${cart_id}/items/${item_id}`, { quantity });

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

    const data: StandardResponse<null> = await res.json();
    if (data.status !== "success") {
      return rejectWithValue(data.message);
    }

    return { id: item_id };
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to delete item");
  }
});

// ---------------------- DELETE ALL ITEM --------------------
export const clearCart = createAsyncThunk<
  { cart_id: string },
  string, // cartId
  { rejectValue: string }
>("cart/clearCart", async (cartId, { rejectWithValue }) => {
  try {
    const res = await DELETE<StandardResponse<{ deleted_cart_id: string }>>(
      `/carts/${cartId}/items`
    );

    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }

    return { cart_id: res.data.deleted_cart_id };
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.message || "Failed to clear cart");
  }
});
