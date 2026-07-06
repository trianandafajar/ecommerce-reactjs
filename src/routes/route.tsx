import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
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
const ProductsPage = lazy(() => import("@/pages/ProductsPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const CustomerDashboardPage = lazy(() => import("@/pages/customer/CustomerDashboardPage"));
const CustomerOrdersPage = lazy(() => import("@/pages/customer/CustomerOrdersPage"));
const CustomerHistoryPage = lazy(() => import("@/pages/customer/CustomerHistoryPage"));
const CustomerOrderTrackPage = lazy(() => import("@/pages/customer/CustomerOrderTrackPage"));
const AdminOverviewPage = lazy(() => import("@/pages/admin/AdminOverviewPage"));
const AdminOrdersPage = lazy(() => import("@/pages/admin/AdminOrdersPage"));
const AdminCustomersPage = lazy(() => import("@/pages/admin/AdminCustomersPage"));
const AdminProductsPage = lazy(() => import("@/pages/admin/AdminProductsPage"));
const AdminProductFormPage = lazy(() => import("@/pages/admin/AdminProductFormPage"));
const AdminReportsPage = lazy(() => import("@/pages/admin/AdminReportsPage"));

import { productDetailLoader } from "@/routes/productLoader";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";
import AdminRoute from "@/routes/AdminRoute";
import CustomerRoute from "@/routes/CustomerRoute";
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
            path: "/products",
            element: <ProductsPage />,
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
            path: "/my",
            element: <CustomerRoute />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <CustomerDashboardPage /> },
              { path: "orders", element: <CustomerOrdersPage /> },
              { path: "history", element: <CustomerHistoryPage /> },
              { path: "orders/:orderId", element: <CustomerOrderTrackPage /> },
              { path: "profile", element: <ProfilePage /> },
              { path: "cart", element: <Navigate to="/cart" replace /> },
              { path: "products", element: <Navigate to="/products" replace /> },
            ],
          },
          {
            path: "/admin",
            element: <AdminRoute />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", element: <AdminOverviewPage /> },
              { path: "profile", element: <ProfilePage /> },
              { path: "orders", element: <AdminOrdersPage /> },
              { path: "customers", element: <AdminCustomersPage /> },
              { path: "products", element: <AdminProductsPage /> },
              { path: "products/new", element: <AdminProductFormPage /> },
              { path: "products/:productId/edit", element: <AdminProductFormPage /> },
              { path: "reports", element: <AdminReportsPage /> },
              { path: "product/create", element: <Navigate to="/admin/products/new" replace /> },
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
