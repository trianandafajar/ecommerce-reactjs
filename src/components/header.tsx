import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, User, ShoppingBag, LogOut, Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigationSidebar";
import { SearchModal } from "@/components/searchModal";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectBookmarkCount } from "@/features/bookmark/bookmarkSlice";
import { selectCartItems } from "@/features/cart/cartSlice";
import { selectIsAuthenticated, selectUser } from "@/features/auth/authSlice";
import { logoutThunk } from "@/features/auth/authThunks";
import { selectSearchQuery } from "@/features/search/searchSlice";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const dispatch = useAppDispatch();

  const bookmarkCount = useAppSelector(selectBookmarkCount);
  const cartItems = useAppSelector(selectCartItems);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const searchQuery = useAppSelector(selectSearchQuery);

  const handleUserClick = () => {
    if (isAuthenticated) {
      dispatch(logoutThunk());
    } else {
      window.location.href = "/auth/login";
    }
  };

  const searchLabel =
    searchQuery.trim() !== ""
      ? searchQuery.length > 20
        ? searchQuery.slice(0, 20) + "..."
        : searchQuery
      : "Search";

  return (
    <>
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between px-2 sm:px-6 md:px-8 py-4 max-w-7xl mx-auto h-20">
          <div className="flex-1 flex items-center gap-1 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center gap-1 sm:gap-2 text-foreground hover:bg-accent hover:text-accent-foreground px-1 sm:px-3 cursor-pointer relative"
            >
              <Menu className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Menu</span>
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-1 sm:gap-2 text-foreground hover:bg-accent hover:text-accent-foreground px-1 sm:px-3 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">{searchLabel}</span>
            </Button>
          </div>

          <div className="flex-shrink-0">
            <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tighter sm:tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-primary animate-gradient-x">
                KEYSTHETIX
              </h1>
            </Link>
          </div>

          <div className="flex-1 flex items-center justify-end gap-1 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground px-1 sm:px-3 flex items-center justify-center"
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Link to="/admin/product/create" title="Add item" className="flex">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground px-1 sm:px-3 flex items-center justify-center"
              >
                <Plus />
              </Button>
            </Link>
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground px-1 sm:px-3 relative"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground cursor-pointer hover:bg-accent hover:text-accent-foreground px-1 sm:px-3 flex items-center gap-1"
              onClick={handleUserClick}
              title={isAuthenticated ? `Logout (${user?.name})` : "Login"}
            >
              {isAuthenticated ? <LogOut className="w-4 h-4" /> : <User className="w-4 h-4" />}
              <span className="text-xs hidden sm:inline">
                {isAuthenticated ? user?.name : "Login"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NavigationSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
