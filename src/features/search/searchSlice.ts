import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { fetchSearchSuggestions } from "./searchThunks";

interface SearchState {
  query: string;
  results: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: "",
  results: [], // default populer
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.results = [...state.results]
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.slice(0, 8);
      })
      .addCase(fetchSearchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch suggestions";
        state.results = [];
      });
  },
});

export const { setQuery, clearQuery } = searchSlice.actions;
export default searchSlice.reducer;

// selectors
export const selectSearchQuery = (state: RootState) => state.search.query;
export const selectSearchResults = (state: RootState) => state.search.results;
export const selectSearchLoading = (state: RootState) => state.search.loading;
export const selectSearchError = (state: RootState) => state.search.error;
