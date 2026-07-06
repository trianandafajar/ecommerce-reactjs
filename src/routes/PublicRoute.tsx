import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectIsAdmin, selectIsAuthenticated } from "@/features/auth/authSlice";

export default function PublicRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/my/dashboardq"} replace />;
  }

  return <Outlet />;
}
