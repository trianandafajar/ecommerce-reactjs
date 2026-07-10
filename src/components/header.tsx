import { memo, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  User,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NavigationSidebar } from "@/components/navigationSidebar";
import { SearchModal } from "@/components/searchModal";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectBookmarkCount } from "@/features/bookmark/bookmarkSlice";
import { selectCartItemCount } from "@/features/cart/cartSlice";
import { selectIsAuthenticated, selectUser } from "@/features/auth/authSlice";
import { logoutThunk } from "@/features/auth/authThunks";
import { selectSearchQuery } from "@/features/search/searchSlice";

const SearchButtonLabel = memo(function SearchButtonLabel() {
  const searchQuery = useAppSelector(selectSearchQuery);

  if (!searchQuery.trim()) {
    return <span className="hidden text-sm sm:inline">Search</span>;
  }

  return (
    <span className="hidden text-sm sm:inline">
      {searchQuery.length > 20 ? `${searchQuery.slice(0, 20)}...` : searchQuery}
    </span>
  );
});

function getInitials(name?: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") !== "light",
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => setIsDarkMode((prev) => !prev), []);
  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const bookmarkCount = useAppSelector(selectBookmarkCount);
  const cartItemCount = useAppSelector(selectCartItemCount);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/my/dashboard";
  const profilePath = user?.role === "admin" ? "/admin/profile" : "/my/profile";

  const handleLogout = useCallback(() => {
    void dispatch(logoutThunk());
    navigate("/auth/login");
  }, [dispatch, navigate]);

  const handleDashboard = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    navigate(dashboardPath);
  }, [dashboardPath, isAuthenticated, navigate]);

  const handleProfile = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    navigate(profilePath);
  }, [isAuthenticated, navigate, profilePath]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <a
          href="#main-content"
          className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50"
        >
          Skip to content
        </a>

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-3 py-4 sm:px-6 md:px-8">
          <div className="flex flex-1 items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={openMenu}
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="navigation-sidebar"
              className="relative flex h-10 cursor-pointer items-center gap-2 rounded-full px-3 text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Menu className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden text-sm font-medium sm:inline">Menu</span>
              {bookmarkCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                  aria-label={`${bookmarkCount} bookmarks`}
                >
                  {bookmarkCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={openSearch}
              aria-label="Open search"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full px-3 text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
              <SearchButtonLabel />
            </Button>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/"
              aria-label="Keysthetix Home"
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              <span className="text-lg font-semibold tracking-[0.18em] text-foreground sm:text-2xl">
                KEYSTHETIX
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 cursor-pointer rounded-full px-3 text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>

            <Link to="/cart" aria-label={`Shopping cart, ${cartItemCount} items`}>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-10 cursor-pointer rounded-full px-3 text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs text-background dark:bg-background dark:text-foreground"
                    aria-hidden="true"
                  >
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex h-11 items-center gap-3 rounded-full border border-border bg-card px-3 text-left transition-colors hover:bg-accent/60 focus-visible:border-primary/50 focus-visible:bg-accent/60 focus-visible:outline-none"
                    aria-label="Open account menu"
                  >
                    <Avatar className="h-8 w-8 border border-border bg-card">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="hidden min-w-0 text-left sm:block">
                      <p className="max-w-[140px] truncate text-sm font-medium leading-none text-foreground">
                        {user?.name ?? "User"}
                      </p>
                    </div>
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  sideOffset={10}
                  className="w-80 overflow-hidden rounded-2xl border border-border bg-card p-0 text-foreground shadow-xl shadow-black/10"
                >
                  <div className="border-b border-border bg-card p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border border-border bg-background">
                        <AvatarFallback className="bg-primary/10 text-base font-semibold text-primary">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user?.name ?? "User"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user?.email ?? "account@store.local"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 p-2">
                    <button
                      type="button"
                      onClick={handleProfile}
                      className="flex h-14 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <UserRound className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">Profile</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="flex h-14 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <LayoutDashboard className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">Dashboard</p>
                      </div>
                    </button>
                    <div className="my-2 h-px bg-border" />

                    <Button
                      type="button"
                      variant="ghost"
                      className="flex h-14 w-full justify-start gap-3 rounded-xl px-3 text-left text-sm font-semibold text-red-500 hover:bg-red-500/10 hover:text-red-600 focus-visible:bg-red-500/10 focus-visible:outline-none"
                      onClick={handleLogout}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                        <LogOut className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">Logout</p>
                      </div>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer px-1 text-foreground hover:bg-accent hover:text-accent-foreground sm:px-3"
                onClick={() => navigate("/auth/login")}
              >
                <User className="h-4 w-4" aria-hidden="true" />
                <span className="hidden text-xs font-semibold sm:inline">Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
      <NavigationSidebar isOpen={isMenuOpen} onClose={closeMenu} />
    </>
  );
}
