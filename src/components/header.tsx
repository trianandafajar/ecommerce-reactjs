import { memo, useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  User,
  UserRound,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigationSidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchModal } from "@/components/searchModal";
import { selectIsAuthenticated, selectUser } from "@/features/auth/authSlice";
import { logoutThunk } from "@/features/auth/authThunks";
import { selectBookmarkCount } from "@/features/bookmark/bookmarkSlice";
import { selectCartItemCount } from "@/features/cart/cartSlice";
import { selectSearchQuery } from "@/features/search/searchSlice";

const SCROLL_THRESHOLD = 240;

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const bookmarkCount = useAppSelector(selectBookmarkCount);
  const cartItemCount = useAppSelector(selectCartItemCount);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > SCROLL_THRESHOLD,
  );

  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/my/dashboard";

  const profilePath = user?.role === "admin" ? "/admin/profile" : "/my/profile";

  useEffect(() => {
    const root = document.documentElement;

    root.classList.add("dark");

    try {
      localStorage.setItem("theme", "dark");
    } catch {
      // Keep the app in dark mode even if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const updateHeaderState = () => {
      animationFrameId = null;

      const nextIsScrolled = window.scrollY > SCROLL_THRESHOLD;

      setIsScrolled((currentValue) =>
        currentValue === nextIsScrolled ? currentValue : nextIsScrolled,
      );
    };

    const handleScroll = () => {
      if (animationFrameId !== null) return;

      animationFrameId = window.requestAnimationFrame(updateHeaderState);
    };

    updateHeaderState();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

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
      <header
        className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
          isScrolled
            ? "border-b border-border/60 bg-background/88 shadow-sm shadow-black/5 backdrop-blur-xl"
            : "border-b border-border/60 bg-background/88 shadow-sm shadow-black/5 backdrop-blur-xl sm:border-transparent sm:bg-transparent sm:shadow-none sm:backdrop-blur-none"
        }`}
      >
        <a
          href="#main-content"
          className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60]"
        >
          Skip to content
        </a>

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-3 py-4 sm:gap-4 sm:px-6 md:px-8">
          <div className="flex flex-1 items-center gap-1 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openMenu}
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="navigation-sidebar"
              className="relative flex h-10 cursor-pointer items-center gap-2 rounded-full px-2.5 text-foreground hover:bg-accent/70 hover:text-accent-foreground sm:px-3"
            >
              <Menu className="size-4 shrink-0" aria-hidden="true" />

              {bookmarkCount > 0 && (
                <span
                  className="absolute right-1 top-1 flex size-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold leading-none text-white"
                  aria-label={`${bookmarkCount} bookmarks`}
                >
                  {bookmarkCount > 99 ? "99+" : bookmarkCount}
                </span>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={openSearch}
              aria-label="Open search"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-full px-2.5 text-foreground hover:bg-accent/70 hover:text-accent-foreground sm:px-3"
            >
              <Search className="size-4 shrink-0" aria-hidden="true" />

              <SearchButtonLabel />
            </Button>
          </div>

          <div className="shrink-0">
            <Link
              to="/"
              aria-label="Keysthetix Home"
              className="cursor-pointer transition-opacity duration-200 hover:opacity-75"
            >
              <span className="text-lg font-semibold tracking-[0.18em] text-foreground sm:text-2xl">
                KEYSTHETIX
              </span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative size-9 cursor-pointer rounded-full text-foreground hover:bg-accent/70 hover:text-accent-foreground"
              asChild
            >
              <Link
                to="/cart"
                aria-label={`Shopping cart, ${cartItemCount} items`}
                title="Shopping cart"
              >
                <ShoppingBag className="size-5" aria-hidden="true" />

                {cartItemCount > 0 && (
                  <span
                    className="absolute right-1 top-1 flex size-3 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background"
                    aria-hidden="true"
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>
            </Button>

            {isAuthenticated ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10 items-center gap-2 rounded-full  bg-transparent  px-1.5 pr-3 text-left transition-colors  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Open account menu"
                    title={user?.name ?? "Account"}
                  >
                    <Avatar className="size-8 border-2 border-primary/50">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="end"
                  sideOffset={10}
                  className="w-72 overflow-hidden rounded-2xl border border-border bg-card p-0 text-foreground shadow-xl shadow-black/10"
                >
                  <div className="border-b border-border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-11 border border-primary/25 bg-transparent">
                        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user?.name ?? "User"}
                        </p>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {user?.email ?? "account@store.local"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 p-2">
                    <button
                      type="button"
                      onClick={handleProfile}
                      className="flex h-12 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <UserRound className="size-4" />
                      </span>

                      <span className="text-sm font-medium text-foreground">
                        Profile
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="flex h-12 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <LayoutDashboard className="size-4" />
                      </span>

                      <span className="text-sm font-medium text-foreground">
                        Dashboard
                      </span>
                    </button>

                    <div className="my-2 h-px bg-border" />

                    <Button
                      type="button"
                      variant="ghost"
                      className="flex h-12 w-full justify-start gap-3 rounded-xl px-3 text-left text-sm font-semibold text-red-500 hover:bg-red-500/10 hover:text-red-600 focus-visible:bg-red-500/10 focus-visible:outline-none"
                      onClick={handleLogout}
                    >
                      <span className="flex size-9 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                        <LogOut className="size-4" />
                      </span>

                      <span>Logout</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="cursor-pointer px-1 text-foreground hover:bg-accent hover:text-accent-foreground sm:px-3"
                onClick={() => navigate("/auth/login")}
              >
                <User className="size-4" aria-hidden="true" />
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
