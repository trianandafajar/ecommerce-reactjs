import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

const HomePage = lazy(() => import("@/pages/homePage"));
const LoginPage = lazy(() => import("@/pages/loginPage"));
const ProductPage = lazy(() => import("@/pages/productDetailPage"));
const CartPage = lazy(() => import("@/pages/cartPage"));
const CheckoutPage = lazy(() => import("@/pages/checkoutPage"));
const BookmarksPage = lazy(() => import("@/pages/bookmarkPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const VerifyOtpPage = lazy(() => import("@/pages/VerifyOtpPage"));
const CreateProductPage = lazy(() => import("@/pages/CreateProductPage"));

import { productDetailLoader } from "@/routes/productLoader";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import MainLayout from "@/components/MainLayout";

const LoadingScreen = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        ),
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/admin/product/create",
            element: <CreateProductPage />,
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
        ],
      },
    ],
  },
]);
