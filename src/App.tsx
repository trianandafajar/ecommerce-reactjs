import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { store } from "@/app/store";
import { router } from "./routes/route";
import { useEffect, useRef } from "react";
import { fetchCurrentUserThunk } from "@/features/auth/authThunks";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Cookies from "js-cookie";
import { lookupCart } from "./features/cart/cartThunks";
import { loadBookmarksFromStorage } from "./features/bookmark/bookmarkSlice";
import { selectIsInitialized } from "./features/auth/authSlice";

function AppContent() {
  const dispatch = useAppDispatch();
  const isInitialized = useAppSelector(selectIsInitialized);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    dispatch(loadBookmarksFromStorage());

    const token = Cookies.get("access_token");
    if (token) {
      dispatch(fetchCurrentUserThunk()).then((result) => {
        if (fetchCurrentUserThunk.fulfilled.match(result)) {
          dispatch(lookupCart({}));
        }
      });
   }
  }, [dispatch]);

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
