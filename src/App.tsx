import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "@/app/store";
import { Footer } from "@/components/foother";
import { router } from "./routes/route";
import { useEffect } from "react";
import { fetchCurrentUserThunk } from "@/features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Cookies from "js-cookie";
import { fetchProducts } from "./features/product/productThunks";
import { lookupCart } from "./features/cart/cartThunks";
import { selectIsAuthenticated } from "./features/auth/authSlice";
import { loadBookmarksFromStorage } from "./features/bookmark/bookmarkSlice";

function AppContent() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    const initializeApp = async () => {
      dispatch(fetchProducts({ page: 1, per_page: 12 }));

      const token = Cookies.get("access_token");
      if (token) {
        await dispatch(fetchCurrentUserThunk());
        dispatch(lookupCart({}));
        dispatch(loadBookmarksFromStorage())
      }
    };

    initializeApp();
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <RouterProvider router={router} />
      <Footer />
    </>
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
