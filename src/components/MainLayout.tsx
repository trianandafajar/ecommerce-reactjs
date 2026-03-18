import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./foother";
import { useAppSelector } from "@/app/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";

export default function MainLayout() {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Routes that should NOT have a footer
  const noFooterRoutes = ["/admin", "/auth"];
  const protectedRoutes = ["/cart", "/checkout", "/bookmarks"];
  
  const isNoFooterPath = noFooterRoutes.some(path => location.pathname.startsWith(path));
  const isProtectedAndNotAuth = protectedRoutes.includes(location.pathname) && !isAuthenticated;

  const hideFooter = isNoFooterPath || isProtectedAndNotAuth;

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
