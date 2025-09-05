import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Product } from "@/features/product/types/product";


interface BookmarkState {
  bookmarkedItems: Product[];
}

const initialState: BookmarkState = {
  bookmarkedItems: [],
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    loadBookmarksFromStorage: (state) => {
      const saved = localStorage.getItem("bookmarked-items");
      if (saved) {
        state.bookmarkedItems = JSON.parse(saved);
      }
    },
    addBookmark: (state, action: PayloadAction<Product>) => {
      state.bookmarkedItems.push(action.payload);
      localStorage.setItem("bookmarked-items", JSON.stringify(state.bookmarkedItems));
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarkedItems = state.bookmarkedItems.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem("bookmarked-items", JSON.stringify(state.bookmarkedItems));
    },
    clearBookmarks: (state) => {
      state.bookmarkedItems = [];
      localStorage.removeItem("bookmarked-items");
    },
  },
});

export const { loadBookmarksFromStorage, addBookmark, removeBookmark, clearBookmarks } =
  bookmarkSlice.actions;

export default bookmarkSlice.reducer;

export const selectBookmarkedItems = (state: RootState) => state.bookmark.bookmarkedItems;
export const selectBookmarkCount = (state: RootState) => state.bookmark.bookmarkedItems.length;
export const selectIsBookmarked = (id: string) => (state: RootState) =>
  state.bookmark.bookmarkedItems.some((item) => item.id === id);
