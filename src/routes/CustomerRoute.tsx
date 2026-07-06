import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import {
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsInitialized,
} from "@/features/auth/authSlice";
import CustomerLayout from "@/components/customer/CustomerLayout";

export default function CustomerRoute() {
  const location = useLocation();
  const isInitialized = useAppSelector(selectIsInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);

  if (!isInitialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
          <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
          Loading customer area
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <CustomerLayout />;
}

