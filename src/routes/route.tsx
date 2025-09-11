import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/homePage";
import LoginPage from "@/pages/loginPage";
import ProductPage from "@/pages/productDetailPage";
import CartPage from "@/pages/cartPage";
import CheckoutPage from "@/pages/checkoutPage";
import BookmarksPage from "@/pages/bookmarkPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import NotFoundPage from "@/pages/NotFoundPage";
import VerifyOtpPage from "@/pages/VerifyOtpPage";

import { productDetailLoader } from "@/routes/productLoader";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import CreateProductPage from "@/pages/CreateProductPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin/product/create",
    element: <CreateProductPage />
  },
  {
    element: <PublicRoute />,
    children: [
      { path: "/auth/login", element: <LoginPage /> },
      { path: "/auth/register", element: <RegisterPage /> },
      { path: "/auth/reset-password", element: <ResetPasswordPage /> },
      { path: "/auth/verify-otp", element: <VerifyOtpPage /> },
      { path: "/auth/forgot-password", element: <ForgotPasswordPage /> },
    ],
  },

  {
    path: "/product/:id",
    element: <ProductPage />,
    loader: productDetailLoader,
  },

  {
    element: <ProtectedRoute />,
    children: [
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/bookmarks", element: <BookmarksPage /> },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
