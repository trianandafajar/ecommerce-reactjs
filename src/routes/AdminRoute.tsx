import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import {
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsInitialized,
} from "@/features/auth/authSlice";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminRoute() {
  const location = useLocation();
  const isInitialized = useAppSelector(selectIsInitialized);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 text-white grid place-items-center">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
          <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
          Loading admin workspace
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminLayout />;
}
