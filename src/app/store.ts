import { configureStore } from "@reduxjs/toolkit";
import authReducer from '@/features/auth/authSlice'
import bookmarkReducer from "@/features/bookmark/bookmarkSlice";
import cartReducer from "@/features/cart/cartSlice";
import searchReducer from "@/features/search/searchSlice"
import productReduce from "@/features/product/productSlice"
import orderReduce from '@/features/order/orderSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookmark: bookmarkReducer,
    cart: cartReducer,
    search: searchReducer,
    product: productReduce,
    order: orderReduce,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
