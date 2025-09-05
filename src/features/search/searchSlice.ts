// src/features/search/searchSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

interface SearchState {
  query: string;
  results: string[];
}

const searchData = [
  "Christopher Backpack",
  "Christopher PM",
  "Christopher MM",
  "Neverfull",
  "Speedy",
  "Twist",
  "Capucines",
  "Petite Malle",
  "Alma",
  "Keepall",
  "Monogram Canvas",
  "Damier Ebene",
  "Epi Leather",
  "Bags and Wallets",
  "Women",
  "Men",
  "Jewelry",
  "Watches",
  "Perfumes and Beauty",
];

const initialState: SearchState = {
  query: "",
  results: searchData.slice(0, 6), // default populer
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      if (state.query.trim() === "") {
        state.results = searchData.slice(0, 6);
      } else {
        const filtered = searchData.filter((item) =>
          item.toLowerCase().includes(state.query.toLowerCase())
        );
        state.results = filtered.slice(0, 8);
      }
    },
    clearQuery: (state) => {
      state.query = "";
      state.results = searchData.slice(0, 6);
    },
  },
});

export const { setQuery, clearQuery } = searchSlice.actions;
export default searchSlice.reducer;

// selectors
export const selectSearchQuery = (state: RootState) => state.search.query;
export const selectSearchResults = (state: RootState) => state.search.results;
