import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Product } from "@/features/product/types/product";


interface BookmarkState {
  bookmarkedItems: Product[];
  bookmarkedIds: Record<string, true>;
}

const initialState: BookmarkState = {
  bookmarkedItems: [],
  bookmarkedIds: {},
};

const createBookmarkIdMap = (items: Product[]) =>
  items.reduce<Record<string, true>>((acc, item) => {
    acc[item.id] = true;
    return acc;
  }, {});

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    loadBookmarksFromStorage: (state) => {
      const saved = localStorage.getItem("bookmarked-items");
      if (saved) {
        state.bookmarkedItems = JSON.parse(saved);
        state.bookmarkedIds = createBookmarkIdMap(state.bookmarkedItems);
      }
    },
    addBookmark: (state, action: PayloadAction<Product>) => {
      if (state.bookmarkedIds[action.payload.id]) {
        return;
      }
      state.bookmarkedItems.push(action.payload);
      state.bookmarkedIds[action.payload.id] = true;
      localStorage.setItem("bookmarked-items", JSON.stringify(state.bookmarkedItems));
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.bookmarkedItems = state.bookmarkedItems.filter(
        (item) => item.id !== action.payload
      );
      delete state.bookmarkedIds[action.payload];
      localStorage.setItem("bookmarked-items", JSON.stringify(state.bookmarkedItems));
    },
    clearBookmarks: (state) => {
      state.bookmarkedItems = [];
      state.bookmarkedIds = {};
      localStorage.removeItem("bookmarked-items");
    },
  },
});

export const { loadBookmarksFromStorage, addBookmark, removeBookmark, clearBookmarks } =
  bookmarkSlice.actions;

export default bookmarkSlice.reducer;

export const selectBookmarkedItems = (state: RootState) => state.bookmark.bookmarkedItems;
export const selectBookmarkCount = (state: RootState) => state.bookmark.bookmarkedItems.length;
export const selectBookmarkedIds = (state: RootState) => state.bookmark.bookmarkedIds;
export const selectIsBookmarked = (id: string) => (state: RootState) =>
  Boolean(state.bookmark.bookmarkedIds[id]);
