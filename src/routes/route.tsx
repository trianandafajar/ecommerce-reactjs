import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/homePage";
import LoginPage from "@/pages/loginPage";
import ProductPage from "@/pages/productDetailPage";
import CartPage from "@/pages/cartPage";
import CheckoutPage from "@/pages/checkoutPage";
import BookmarksPage from "@/pages/bookmarkPage";
import { productDetailLoader, productLoader } from '@/routes/productLoader';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    loader: productLoader,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/product/:id",
    element: <ProductPage />,
    loader: productDetailLoader,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/bookmarks",
    element: <BookmarksPage />,
  },
]);
