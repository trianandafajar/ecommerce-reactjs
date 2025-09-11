import { createAsyncThunk } from "@reduxjs/toolkit";
import type { StandardResponse } from "@/types/api";
import { GET } from "@/lib/api";

export const fetchSearchSuggestions = createAsyncThunk<
  string[],
  { query: string; limit?: number },
  { rejectValue: string }
>("search/fetchSuggestions", async (payload, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<string[]>>("/products/suggestions", {
      params: {
        q: payload.query,
        limit: payload.limit ?? 8,
      },
    });

    if (res.status !== "success") {
      return rejectWithValue(res.message);
    }

    return res.data;
  } catch (err: any) {
    console.error("fetchSearchSuggestions error:", err);
    return rejectWithValue(err.message || "Failed to fetch suggestions");
  }
});
