import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "@/app/store";
import { router } from "./routes/route";
import { useEffect } from "react";
import { fetchCurrentUserThunk } from "@/features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Cookies from "js-cookie";
import { fetchProducts } from "./features/product/productThunks";
import { lookupCart } from "./features/cart/cartThunks";
import { loadBookmarksFromStorage } from "./features/bookmark/bookmarkSlice";

function AppContent() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.product.items);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ page: 1, per_page: 12 }));
    }
    
    dispatch(loadBookmarksFromStorage());
  }, [dispatch, products.length]);

  useEffect(() => {
    const initializeUser = async () => {
      const token = Cookies.get("access_token");
      if (token) {
        await dispatch(fetchCurrentUserThunk());
        dispatch(lookupCart({}));
      }
    };

    initializeUser();
  }, [dispatch]);

  return (
    <RouterProvider router={router} />
  );
}

function App() {
  return (
    <Provider store={store}>
      <div className="font-sans antialiased">
        <AppContent />
      </div>
    </Provider>
  );
}

export default App;
