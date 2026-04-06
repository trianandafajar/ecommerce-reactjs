import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "@/app/store";
import { router } from "./routes/route";
import { useEffect, useRef } from "react";
import { fetchCurrentUserThunk } from "@/features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Cookies from "js-cookie";
import { fetchProducts } from "./features/product/productThunks";
import { lookupCart } from "./features/cart/cartThunks";
import { loadBookmarksFromStorage } from "./features/bookmark/bookmarkSlice";
import { selectIsInitialized } from "./features/auth/authSlice";

function AppContent() {
  const dispatch = useAppDispatch();
  const productCount = useAppSelector((state) => state.product.items.length);
  const isInitialized = useAppSelector(selectIsInitialized);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // ✅ Fetch produk & bookmarks tidak perlu tunggu auth
    if (productCount === 0) {
      dispatch(fetchProducts({ page: 1, per_page: 12 }));
    }
    dispatch(loadBookmarksFromStorage());

    // ✅ Auth init — hanya kalau ada token
    const token = Cookies.get("access_token");
    if (token) {
      dispatch(fetchCurrentUserThunk()).then((result) => {
        // ✅ Fetch cart hanya kalau user berhasil diambil
        if (fetchCurrentUserThunk.fulfilled.match(result)) {
          dispatch(lookupCart({}));
        }
      });
      // isInitialized di-set oleh fulfilled/rejected fetchCurrentUserThunk
    }
    // isInitialized langsung true dari initialState kalau tidak ada token
  }, []);

  // ✅ Blok render router sampai auth selesai dicek
  // Mencegah ProtectedRoute & PublicRoute flash redirect
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
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