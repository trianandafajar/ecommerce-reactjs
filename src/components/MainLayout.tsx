import { useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./foother";
import { useAppSelector } from "@/app/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";

const NO_FOOTER_ROUTES = ["/admin", "/auth"];
const PROTECTED_ROUTES = ["/cart", "/checkout", "/bookmarks"];

export default function MainLayout() {
  const { hash } = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const scrollToLocation = useCallback(() => {
    if (hash) {
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          return;
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [hash]);

  useEffect(() => {
    scrollToLocation();
  }, [scrollToLocation]);

  const isNoFooterPath = NO_FOOTER_ROUTES.some((path) =>
    location.pathname.startsWith(path),
  );
  const isProtectedAndNotAuth =
    PROTECTED_ROUTES.includes(location.pathname) && !isAuthenticated;

  const hideFooter = isNoFooterPath || isProtectedAndNotAuth;

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <Header />
      <main className="flex-grow" id="main-content">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
