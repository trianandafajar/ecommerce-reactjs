import { createAsyncThunk } from "@reduxjs/toolkit";

export const createAsyncChunk = createAsyncThunk;

export const createCartSessions = createAsyncChunk<
  any,
  any,
  any
>(
  'cart/createCartSessions',
  async (_, { rejectWithValue }) => {
    try {
      return {};
    } catch (error) {
      return rejectWithValue('Failed to create cart session');
    }
  }
);
